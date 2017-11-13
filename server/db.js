// Database functions module
import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import search from "search.js";

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

        connection.query("INSERT INTO users (name, username, pwd) VALUES (?, ?, ?)", [name, username, hash], (err, results) => {
            if (err) {
                // Can't simply throw an error here, return an error message instead.
                func(null, {
                    success: false,
                    message: "Unknown error occurred, try again."
                });
                return;
            }

            connection.query("INSERT INTO subscriptions VALUES (?, ?)", [username, username], (e) => {
                if (e) {
                    func(null, {
                        success: false,
                        message: "Unknown error occurred, try again."
                    });
                    return;
                }
                // No error, inserted successfully, so return true.
                func(null, {
                    success: true,
                    message: "Successfully registered!",
                    username
                });
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
    connection.query("INSERT INTO videos (username, title, views, video_path,\
            thumbnail, upload_date, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [username, title, 0, path, thumbnail, date, desc], (err, results) => {
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
        WHERE DATEDIFF(?, upload_date) < 6 \
        ORDER BY views DESC";
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
    let sql = "SELECT views, DATEDIFF(?, upload_date) AS age \
         FROM videos \
        WHERE video_id = ?";
    connection.query(sql, [new Date().toISOString(), id], (err, results) => {
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
    let sql = "SELECT name, username, dp, background, COUNT(subscriber_id) AS subscribers \
         FROM users, subscriptions \
        WHERE BINARY users.username = ?";
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

        /* Not sure if following part is required anymore, since
            DB now uses username as a foreign key attribute. This
            must be confirmed before removing the code. */

        /*
        let sql = "DELETE FROM videos WHERE username = ?";
        connection.query(sql, [username], (err) => {
            if (err) {
                func(err);
                return;
            }

            func();
        }); */

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

module.exports = exports;
