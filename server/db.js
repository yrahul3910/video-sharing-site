// Database functions module
import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import search from "./search.js";
import groupBy from "lodash.groupby";
import { Object } from "core-js/library/web/timers";

let connection;

/**
 * Establishes a connection to the database.
 */
exports.init = () => {
    dotenv.config();
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: "video_sharing"
    });
    connection.connect();
};

/**
 * Terminates connection to the database.
 */
exports.terminate = () => {
    connection.end();
};

/**
 * Checks if the user has entered the right set of authentication details.
 * @param {string} username - The username entered
 * @param {string} pwd - The plaintext password entered
 * @param {Function} func - The callback function
 */
exports.authenticate = (username, pwd, func) => {
    connection.query("SELECT * FROM users WHERE BINARY username = ?", [username], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        if (!results.length) {
            func(null, {
                success: false,
                message: "User does not exist."
            });
            return;
        }

        bcrypt.compare(pwd, results[0].pwd, (e, res) => {
            if (e) throw e;

            if (!res)
                func(null, {
                    success: false,
                    message: "Username and password do not match."
                });

            func(null, {
                success: true,
                results: results[0]
            });
        });
    });
};

/**
 * Registers a user by adding the details to the users table. Also adds user to
 * subscriptions table, since by default, every user subscribes to him/herself.
 * @param {string} username - The username of the new user
 * @param {string} pwd - The plaintext password of the user. This will be hashed.
 * @param {string} name - The user's name
 * @param {Function} func - The callback function
 */
exports.register = (username, pwd, name, func) => {
    connection.query("SELECT * FROM users WHERE BINARY username = ?", [username], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        // First check if user exists already.
        if (results.length) {
            func(null, {
                success: false,
                message: "Username already exists."
            });
            return;
        }
    });

    // Gotta hash the password first!
    bcrypt.hash(pwd, 10, (e_, hash) => {
        if (e_) {
            func(e_);
            return;
        }

        connection.query("INSERT INTO users (name, username, pwd) VALUES (?, ?, ?)", [name, username, hash], (err) => {
            if (err) {
                // Can't simply throw an error here, return an error message instead.
                func(null, {
                    success: false,
                    message: "Unknown error occurred, try again."
                });
                return;
            }

            func(null, {
                success: true,
                message: "Successfully registered!",
                username
            });
        });
    });
};

/**
 * Inserts the parameters of the video into the videos table. The actual
 * uploading must be done by the server.
 * @param {string} username - The uploader username
 * @param {string} title - The video title
 * @param {string} path - The path to the video file in the disk
 * @param {string} thumbnail - The path to the thumbnail file on disk
 * @param {Date} date - Date of uploading
 * @param {string} desc - Video description
 * @param {Function} func - The callback function
 */
exports.upload = (username, title, path, thumbnail, date, desc, func) => {
    connection.query("INSERT INTO videos (username, title, video_path,\
            thumbnail, upload_date, description) VALUES (?, ?, ?, ?, ?, ?)",
        [username, title, path, thumbnail, date, desc], (err, results) => {
            if (err) throw err;

            func(null, results.insertId); // func takes no arguments, a call indicates success.
        }
    );
};

/**
 * Submits feedback by adding to the feedback table
 * @param {string} username - The username of the person submitting the feedback
 * @param {string} feedback - The submitted feedback
 * @param {Function} func - The callback function
 */
exports.feedback = (username, feedback, func) => {
    connection.query("SELECT * FROM feedback WHERE BINARY username = ?", [username], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        if (results.length) {
            func(null, {
                success: false,
                message: "You have already submitted feedback!"
            });
            return;
        }

        connection.query("INSERT INTO feedback VALUES (?, ?)", [username, feedback], (err) => {
            if (err) {
                func(err);
                return;
            }

            func(null, {
                success: true,
                message: "Thanks for your feedback!"
            });
        });
    });
};

/**
 * Gives a list of trending videos
 * @param {Function} func - The callback function
 */
exports.trending = (func) => {
    let sql = "SELECT *, DATEDIFF(?, upload_date) AS age \
                 FROM videos \
                WHERE DATEDIFF(?, upload_date) < 6";
    let date = new Date().toISOString();
    connection.query(sql, [date, date], (err, results) => {
        if (err) {
            func(err);
            return;
        }
        func(null, results);
    });
};

/**
 * Returns the views and age of a video.
 * @param {number} id - The video id in the database
 * @param {Function} func - The callback function
 */
exports.details = (id, func) => {
    let sql = "SELECT COUNT(video_views.username) AS views, DATEDIFF(?, upload_date) AS age \
                 FROM videos, video_views \
                WHERE videos.video_id = ? \
                  AND video_views.video_id = ?";
    connection.query(sql, [new Date().toISOString(), id, id], (err, results) => {
        if (err) {
            func(err);
            return;
        }
        func(null, results);
    });
};

/**
 * Returns details of user with given username
 * @param {string} username - The username whose details are required.
 * @param {Function} func - The callback function
 */
exports.userDetails = (username, func) => {
    let sql = "SELECT u.name, u.username, u.dp, COUNT(*) AS subscribers \
                 FROM users AS u \
                      NATURAL JOIN subscriptions AS s \
                WHERE BINARY u.username = ?";
    connection.query(sql, [username], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        if (!results.length)
            func(new Error("Username does not exist."));

        sql = "SELECT * \
                 FROM videos \
                WHERE username = ?";
        connection.query(sql, [username], (e, r) => {
            if (err)
                func(err);

            func(null, {
                user: results,
                videos: r
            });
        });
    });
};

/**
 * Delete a video with the given video_id. Make sure the video was uploaded by
 * the user with the given username.
 * @param {string} username - The user's username
 * @param {number} id - The video_id to delete
 * @param {Function} func - The callback function, taking only one argument.
 */
exports.deleteVideo = (username, id, func) => {
    // First verify if the username is right
    let sql = "SELECT BINARY username = ? AS valid \
                 FROM videos \
                WHERE video_id = ?";
    connection.query(sql, [username, id], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        if (results[0].valid != "1")
            func(new Error("Authorization failed."));
        else {
            sql = "DELETE FROM videos WHERE video_id = ?";
            connection.query(sql, [id], (err) => {
                if (err) {
                    func(err);
                    return;
                }
                search.deleteDoc("qtube", "video", id, (err) => {
                    if(err) {
                        func(err);
                        return;
                    }
                });

                func();
            });
        }
    });
};

/**
 * Deletes a user and all relevant information.
 * @param {string} username - The username whose details must be deleted
 * @param {Function} func - The callback function
 */
exports.deleteUser = (username, func) => {
    let sql = "SELECT video_id \
                 FROM videos \
                WHERE username = ?";
    connection.query(sql, [username], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        // First delete all search indices
        results.forEach((result) => {
            search.deleteDoc("qtube", "video", result.video_id, (err) => {
                if(err) {
                    func(err);
                    return;
                }
            });
        });

        // Delete search index for the user
        search.deleteDoc("qtube", "user", username, (err) => {
            if(err) {
                func(err);
                return;
            }

            // Delete the user from the database
            sql = "DELETE FROM users WHERE username = ?";
            connection.query(sql, [username], (err) => {
                if (err) {
                    func(err);
                    return;
                }

                func();
            });
        });
    });
};

/**
 * Gets all video details
 * @param {string} username - The user's username
 * @param {number} id - The video_id
 * @param {Function} func - The callback function
 */
exports.videoDetails = (username, id, func) => {
    let sql = "SELECT v.*, u.name AS name, u.dp AS dp, vv.views AS views \
                 FROM videos v, users u, video_views vv \
                WHERE v.username = u.username \
                  AND vv.video_id = v.video_id \
                  AND v.video_id = ?";
    connection.query(sql, [id], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        sql = "SELECT COUNT(*) AS ? \
                 FROM video_ratings \
                WHERE rating = ?";
        connection.query(sql, ["upvotes", 1], (e, r) => {
            if (e) {
                func(e);
                return;
            }

            connection.query(sql, ["downvotes", -1], (e_, r_) => {
                if (e_) {
                    func(e_);
                    return;
                }

                // And finally, get details of whether the user has voted on this or not.
                sql = "SELECT COUNT(*) AS count_, rating AS user_rating \
                         FROM users AS u \
                              NATURAL JOIN video_ratings \
                        WHERE video_id = ? \
                          AND username = ?";
                connection.query(sql, [id, username], (_e, _r) => {
                    if (_e) {
                        func(_e);
                        return;
                    }

                    // Merge the properties of all the results (ES6)
                    let finalResults = Object.assign({}, results[0], r[0], r_[0], _r[0]);
                    func(null, finalResults);
                });
            });
        });
    });
};

/**
 * Gets the details of all comments and videos on a video.
 * @param {number} video_id - The video_id whose comment details are required.
 * @param {Function} func - The callback function.
 */
exports.comments = (video_id, func) => {
    let sql = "SELECT u.name, u.username, u.dp, c.comment_date, c.comment, c.comment_id \
                 FROM users AS u \
                      NATURAL JOIN comments AS c \
                WHERE video_id = ?";
    connection.query(sql, [video_id], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        sql = "SELECT u.name, u.username, u.dp, r.reply_date, r.reply_text, r.comment_id \
                 FROM users AS u \
                      NATURAL JOIN replies AS r \
                      \
                      JOIN comments AS c \
                      ON r.comment_id = c.comment_id \
                WHERE c.video_id = ?";
        connection.query(sql, [video_id], (e, r) => {
            if (e) {
                func(e);
                return;
            }

            let finalResult = {comments: results, replies: r};
            func(null, finalResult);
        });
    });
};

/**
 * Adds a comment on the given video
 * @param {number} video_id - The video_id of the video
 * @param {string} comment - The comment to add
 * @param {string} username - The user's username
 * @param {Function} func - The callback function. Accepts only one argument, the error.
 */
exports.addComment = (video_id, comment, username, func) => {
    let sql = "INSERT INTO comments (username, video_id, comment, comment_date) \
               VALUES (?, ?, ?, ?)";
    connection.query(sql, [username, video_id, comment, new Date()], (err) => {
        if (err) {
            func(err);
            return;
        }

        func();
    });
};

/**
 * Adds a new upvote to the video_ratings table
 * @param {number} video_id - The video_id of the video
 * @param {string} username - The user who's voting
 * @param {number} vote - The vote to add to the table
 * @param {Function} func - The callback function. Accepts only one argument.
 */
exports.addVote = (video_id, username, vote, func) => {
    let sql = "INSERT INTO video_ratings \
               VALUES (?, ?, ?)";
    connection.query(sql, [username, video_id, vote], (err) => {
        if (err) {
            func(err);
            return;
        }

        func();
    });
};

/**
 * Swap the upvote with a downvote or vice versa
 * @param {number} video_id - The video_id of the video
 * @param {string} username - The username of the user
 * @param {Function} func - The callback function. Accepts only one argument.
 */
exports.swapVote = (video_id, username, func) => {
    let sql = "UPDATE video_ratings \
                  SET rating = IF (rating = 1, -1, 1) \
                WHERE username = ? \
                  AND video_id = ?";
    connection.query(sql, [username, video_id], (err) => {
        if (err) {
            func(err);
            return;
        }

        func();
    });
};

/**
 *
 * @param {number} video_id - The video_id of the video
 * @param {string} username - The username of the user
 * @param {Function} func - The callback function. Accepts only one argument.
 */
exports.removeVote = (video_id, username, func) => {
    let sql = "DELETE \
                 FROM video_ratings \
                WHERE video_id = ? \
                  AND username = ?";
    connection.query(sql, [video_id, username], (err) => {
        if (err) {
            func(err);
            return;
        }

        func();
    });
};

/**
 * Toggles the subscription status of a user to another.
 * @param {string} username - The user who is being subscribed to (profile)
 * @param {string} subscriber - The user who is subscribing
 * @param {Function} func - The callback function. Only accepts one argument
 */
exports.toggleSubscription = (username, subscriber, func) => {
    let sql = "SELECT COUNT(*) AS count \
                 FROM subscriptions \
                WHERE username = ? \
                  AND subscriber = ?";
    connection.query(sql, [username, subscriber], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        let count = results[0].count;
        if (count == 1) {
            // Remove the subscriptions
            sql = "DELETE \
                     FROM subscriptions \
                    WHERE username = ? \
                      AND subscriber = ?";
            connection.query(sql, [username, subscriber], (e) => {
                if (e) {
                    func(e);
                    return;
                }

                func();
            });
        } else {
            // Subscribe the user
            sql = "INSERT INTO subscriptions (username, subscriber) \
                   VALUES (?, ?)";
            connection.query(sql, [username, subscriber], (e) => {
                if (e) {
                    func(e);
                    return;
                }

                func();
            });
        }
    });
};

/**
 * Adds a reply to the specified comment on the given video
 * @param {number} comment_id - The comment id which is being replied to
 * @param {string} username - The user adding the reply
 * @param {string} reply - The reply text
 * @param {Function} func - The callback function. Accepts only one argument
 */
exports.addReply = (comment_id, username, reply, func) => {
    let sql = "INSERT INTO replies (comment_id, username, reply_text, reply_date) \
               VALUES (?, ?, ?, ?)";
    connection.query(sql, [comment_id, username, reply, new Date()], (err) => {
        if (err) {
            func(err);
            return;
        }

        func();
    });
};

/**
 * Increments the views for a video
 * @param {number} video_id - The id of the video
 * @param {Function} func - The callback function. Accepts only one argument
 */
exports.incrementViews = (video_id, func) => {
    let sql = "CALL increment_views(?)";
    connection.query(sql, [video_id], (err) => {
        if (err) {
            func(err);
            return;
        }

        func();
    });
};

/**
 * Updates the DP of a user.
 * @param {string} username - The username of the user
 * @param {string} dp - The new DP, in base64
 * @param {Function} func - The callback function. Only accepts one argument.
 */
exports.updateDp = (username, dp, func) => {
    let sql = "UPDATE users \
                  SET dp = ? \
                WHERE username = ?";
    connection.query(sql, [dp, username], (err) => {
        if (err) {
            func(err);
            return;
        }

        func();
    });
};

/**
 * Gets all the videos uploaded by users that the subscriber has subscribed to.
 * @param {string} subscriber - The user whose feed must be fetched
 * @param {Function} func - The callback function.
 */
exports.getSubscribedVideos = (subscriber, func) => {
    let sql = "SELECT * \
                 FROM videos AS v \
                      NATURAL JOIN video_views AS vv \
                WHERE username IN (SELECT username \
                                     FROM subscriptions \
                                    WHERE subscriber = ?) \
                  AND username <> ? \
                ORDER BY vv.views";
    connection.query(sql, [subscriber, subscriber], (err, results) => {
        if (err) {
            func(err);
            return;
        }

        let groups = groupBy(results, (val) => val.username);
        func(null, groups);
    });
};

module.exports = exports;
