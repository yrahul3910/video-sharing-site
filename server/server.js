import cors from "cors";
import express from "express";
import path from "path";
import open from "open";
import compression from "compression";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import fs from "fs-path";
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
                data: results[0]
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
                let path = `./videos/${username}/${title}`;
                fs.writeFile(path + `/${video.name}`, video, (e) => {
                    if (e) {
                        res.end(JSON.stringify({success: false, message: "Unknown error while saving video."}));
                        return;
                    }

                    fs.writeFile(path + `/${thumbnail.name}`, thumbnail, (e) => {
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
                                    thumbnail,
                                    description: desc,
                                    video_id: id
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
                    dp: authResult.results.dp,
                    background: authResult.results.background
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
                dp: null,
                background: null
            };
            let token = jwt.sign(user, process.env.SESSION_SECRET, {
                expiresIn: "1 day"
            });

            // Registration successful, add to index and then end response.
            searchUtils.index("qtube", "user", {
                name,
                username,
                user_id: regResult.id
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

app.listen(port, (err) => {
    if (err) throw err;
    open("http://localhost:" + port);
});
