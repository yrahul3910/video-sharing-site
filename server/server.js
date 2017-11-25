import cors from "cors";
import express from "express";
import path from "path";
import open from "open";
import compression from "compression";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import fs from "fs";
import helmet from "helmet";
import numeral from "numeral";

// Used for transpiling
import webpack from "webpack";
import config from "../webpack.config";

import dbUtils from "./db";
import searchUtils from "./search";

const port = 8000;
const app = express();
const compiler = webpack(config);
const illegalCharsFormat = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]/;
dotenv.config();

// gzip files
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser({extended: true}));
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use("/videos", express.static(__dirname + "/../videos"));
app.use("/users", express.static(__dirname + "/../users"));

// Use Webpack middleware
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.get("/api/trending", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    // Define trending as videos uploaded in the last 5 days, with maximum views.
    dbUtils.init();
    dbUtils.trending((err, videos) => {
        if (err) throw err;
        res.end(JSON.stringify({
            success: true,
            videos
        }));
    });
});

app.get("/api/user/:username", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    dbUtils.init();
    dbUtils.userDetails(req.params.username, (err, results) => {
        if (err)
            res.end(JSON.stringify({
                success: false,
                message: "Username does not exist."
            }));
        else
            res.end(JSON.stringify({
                success: true,
                data: results
            }));
    });
});

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.post("/api/upload", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let {video, thumbnail} = files;
        let {title, desc, token} = fields;
        // Verify file types
        if (!thumbnail.type.match(/image\/.*/)) {
            res.end(JSON.stringify({success: false, message: "Thumbnail must be an image."}));
            return;
        }
        if (!video.type.match(/video\/.*/)) {
            res.end(JSON.stringify({success: false, message: "Upload must be a video type."}));
            return;
        }
        if (!title) {
            res.end(JSON.stringify({success: false, message: "Title cannot be empty."}));
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SESSION_SECRET, (e_, decoded) => {
                if (e_) {
                    res.end(JSON.stringify({success: false, message: "No token provided."}));
                    return;
                }
                let username = decoded.username;

                // First check if a video with the same details has already been uploaded.
                if (fs.exists(`./videos/${username}/${title}`)) {
                    res.end(JSON.stringify({
                        success: false,
                        message: "You have uploaded another video with the same details."
                    }));
                    return;
                }

                if (!fs.existsSync("./videos")) {
                    fs.mkdirSync("./videos");
                    fs.mkdirSync(`./videos/${username}`);
                } else if (!fs.existsSync(`./videos/${username}`)) {
                    fs.mkdirSync(`./videos/${username}`);
                }

                let path = `./videos/${username}/${title}`;
                fs.mkdirSync(path);
                fs.rename(video.path, path + `/${video.name}`, (e) => {
                    if (e) {
                        res.end(JSON.stringify({success: false, message: "Unknown error while saving video."}));
                        return;
                    }

                    fs.rename(thumbnail.path, path + `/${thumbnail.name}`, (e) => {
                        if (e) {
                            res.end(JSON.stringify({success: false, message: "Unknown error while saving video."}));
                            return;
                        }

                        // Write data to database.
                        dbUtils.init();
                        dbUtils.upload(username, title, path + `/${video.name}`,
                            path + `/${thumbnail.name}`, new Date(), desc, (err, id) => {
                                // Upload successful, so now add it to index.
                                searchUtils.index("qtube", "video", {
                                    title,
                                    username,
                                    thumbnail: path + `/${thumbnail.name}`,
                                    description: desc,
                                    video_id: id.toString()
                                });

                                res.end(JSON.stringify({success: true, message: "Successfully uploaded!"}));
                            });
                    });
                });
            });
        }
    });
});

app.post("/api/authenticate", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {username, password} = req.body;

    if (!username || !password)
        res.end(JSON.stringify({
            success: false,
            message: "Fields cannot be empty"
        }));
    else {
        dbUtils.init();
        dbUtils.authenticate(username, password, (err, authResult) => {
            if (err) throw err;

            if (authResult.success) {
                let user = {
                    username: authResult.results.username,
                    name: authResult.results.name,
                    dp: authResult.results.dp
                };
                let token = jwt.sign(user, process.env.SESSION_SECRET, {
                    expiresIn: "1 day"
                });
                res.end(JSON.stringify({
                    success: true,
                    message: "Logged in successfully!",
                    user,
                    token
                }));
            } else
                res.end(JSON.stringify({
                    success: false,
                    message: authResult.message
                }));
        });
    }
});

app.post("/api/register", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {username, password, name} = req.body;
    if (!username || !password || !name) {
        res.end(JSON.stringify({
            success: false,
            message: "Fields cannot be empty"
        }));
        return;
    }
    if (illegalCharsFormat.test(username) ||
        illegalCharsFormat.test(name)) {
        res.end(JSON.stringify({
            success: false,
            message: "Special characters aren't allowed in usernames and names."
        }));
        return;
    }
    if (username.includes(" ")) {
        res.end(JSON.stringify({
            success: false,
            message: "Spaces aren't allowed in usernames."
        }));
        return;
    }

    dbUtils.init();
    dbUtils.register(username, password, name, (e, regResult) => {
        if (e) throw e;

        if (regResult.success) {
            let user = {
                username,
                name,
                dp: null
            };
            let token = jwt.sign(user, process.env.SESSION_SECRET, {
                expiresIn: "1 day"
            });

            // Registration successful, add to index and then end response.
            searchUtils.index("qtube", "user", {
                name,
                username
            });

            res.end(JSON.stringify({
                success: regResult.success,
                message: regResult.message,
                token
            }));
        } else
            res.end(JSON.stringify(regResult));
    });
});

app.post("/api/feedback", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {token, feedback} = req.body;

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        dbUtils.init();
        dbUtils.feedback(decoded.username, feedback, (e, result) => {
            if (e) throw e;

            res.end(JSON.stringify(result));
        });
    });
});

app.post("/api/whoami", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {token} = req.body;
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err)
            res.end(JSON.stringify({
                success: false
            }));
        else
            res.end(JSON.stringify({
                success: true,
                user: decoded
            }));
    });
});

app.post("/api/search", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let queryString = req.body.query;
    let body = {
        size: 10, // Number of results
        from: 0, // Start index of results returned
        query: {
            multi_match: {
                query: queryString,
                fields: ["username", "name", "description", "title"],
                minimum_should_match: 1,
                fuzziness: 2
            }
        }
    };
    searchUtils.search("qtube", body).then(results => {
        let response = {
            time: results.took,
            results: results.hits.hits
        };

        res.end(JSON.stringify(response));
    });
});

app.post("/api/video/details", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {id} = req.body;

    dbUtils.init();
    dbUtils.details(id, (err, results) => {
        if (err)
            res.end(JSON.stringify({
                success: false
            }));
        else
            res.end(JSON.stringify({
                success: true,
                age: results[0].age,
                views: numeral(results[0].views).format("0.0a")
            }));
    });
});

app.delete("/api/video/:id", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    jwt.verify(req.body.token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err)
            res.end({success: false});
        else {
            dbUtils.init();
            dbUtils.deleteVideo(decoded.username, req.params.id, (err) => {
                if (err)
                    res.end(JSON.stringify({
                        success: false,
                        message: "Couldn't delete the video."
                    }));
                else {
                    // Now delete the video from search index
                    searchUtils.deleteDoc("qtube", "video", req.params.id, (e) => {
                        if (e) throw e;
                        res.end(JSON.stringify({success: true}));
                    });
                }
            });
        }
    });
});

app.delete("/api/user", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let {token, pwd} = req.body;
    /* Decode the user from the token, and verify the password. If it's right,
        delete the user account, as well as all the user's content. */
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) throw err;

        let {username} = decoded;
        dbUtils.authenticate(username, pwd, (e, authResult) => {
            if (e) throw e;
            if (authResult.success) {
                dbUtils.init();
                dbUtils.deleteUser(username, (e_) => {
                    if (e_) throw e_;

                    res.end(JSON.stringify({success: true}));
                });
            } else
                res.end(JSON.stringify({
                    success: false,
                    message: "Incorrect password"
                }));
        });
    });
});

app.post("/api/video", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let {id, token} = req.body;
    let username;

    dbUtils.init();
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            // User can still watch the video.
            username = null;
        } else
            username = decoded.username;
    });
    dbUtils.videoDetails(username, id, (err, results) => {
        if (err)
            throw err;
        res.end(JSON.stringify({
            success: true,
            details: results
        }));
    });
});

app.post("/api/comments", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let {id} = req.body;
    dbUtils.init();
    dbUtils.comments(id, (err, result) => {
        if (err)
            res.end(JSON.stringify({success: false}));
        else
            res.end(JSON.stringify({success: true, data: result}));
    });
});

app.post("/api/comment", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {token, comment, video_id} = req.body;

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        dbUtils.init();
        dbUtils.addComment(video_id, comment, decoded.username, (e) => {
            if (e)
                res.end(JSON.stringify({success: false}));
            else
                res.end(JSON.stringify({success: true}));
        });
    });
});

app.post("/api/votes", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {token, action, video_id, vote} = req.body;

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            res.end(JSON.stringify({success: false}));
            return;
        }

        let {username} = decoded;
        dbUtils.init();
        switch (action) {
        case "add":
            dbUtils.addVote(video_id, username, vote, (err) => {
                if (err) {
                    res.end(JSON.stringify({success: false}));
                    return;
                }
            });
            break;

        case "update":
            dbUtils.swapVote(video_id, username, (err) => {
                if (err) {
                    res.end(JSON.stringify({success: false}));
                    return;
                }
            });
            break;

        case "remove":
            dbUtils.removeVote(video_id, username, (err) => {
                if (err) {
                    res.end(JSON.stringify({success: false}));
                    return;
                }
            });
            break;
        }
        res.end(JSON.stringify({success: true}));
    });
});

app.post("/api/toggle_subscription", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let {token, profile} = req.body;
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            res.end(JSON.stringify({
                success: false,
                message: err.message
            }));
            return;
        }

        let {username} = decoded;
        dbUtils.init();
        dbUtils.toggleSubscription(profile, username, (e) => {
            if (e) {
                res.end(JSON.stringify({
                    success: false,
                    message: err
                }));
                return;
            } else
                res.end(JSON.stringify({success: true}));
        });
    });
});

app.post("/api/reply", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let {comment_id, text, token} = req.body;
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            res.end(JSON.stringify({success: false}));
            return;
        }

        let {username} = decoded;
        dbUtils.init();
        dbUtils.addReply(comment_id, username, text, (e) => {
            if (e)
                throw e;

            res.end(JSON.stringify({success: true}));
        });
    });
});

app.post("/api/video/add_view", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let {video_id} = req.body;
    dbUtils.init();
    dbUtils.incrementViews(video_id, (err) => {
        if (err) throw err;

        res.end(JSON.stringify({success: true}));
    });
});

app.post("/api/change_dp", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.end(JSON.stringify({success: false, message: "Unknown error occurred"}));
            return;
        }

        let {dp} = files;
        let {token} = fields;
        if (!dp.type.match(/image\/.*/)) {
            res.end(JSON.stringify({success: false, message: "Thumbnail must be an image."}));
            return;
        }

        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (err) {
                res.end(JSON.stringify({success: false}));
                return;
            }
            let {username} = decoded;

            if (!fs.existsSync("./users"))
                fs.mkdirSync("./users");
            if (!fs.existsSync(`./users/${username}`))
                fs.mkdirSync(`./users/${username}`);

            fs.rename(dp.path, `./users/${username}/${dp.name}`, (e) => {
                if (e) {
                    res.end(JSON.stringify({success: false, message: "Failed to upload video."}));
                    return;
                }

                dbUtils.init();
                dbUtils.updateDp(username, `./users/${username}/${dp.name}`, (e) => {
                    if (e) {
                        res.end(JSON.stringify({success: false, message: "Failed to save video."}));
                        return;
                    }

                    res.end(JSON.stringify({success: true}));
                });
            });
        });
    });
});

app.post("/api/feed", (req, res) => {
    // Just use res.json instead in this
    let {token} = req.body;

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            res.json({success: false});
            return;
        }

        let {username} = decoded;
        dbUtils.init();
        dbUtils.getSubscribedVideos(username, (e, results) => {
            if (e)
                throw e;

            res.json({success: true, details: results});
        });
    });
});

app.listen(port, (err) => {
    if (err) throw err;
    open("http://localhost:" + port);
});
