import cors from "cors";
import express from "express";
import path from "path";
import open from "open";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import fs from "fs-path";

// Used for transpiling
import webpack from "webpack";
import config from "./webpack.config";

import dbUtils from "./db.js";

const port = 8000;
const app = express();
const compiler = webpack(config);
dotenv.config();

// gzip files
app.use(compression());
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(bodyParser.json());
app.use(bodyParser({extended: true}));
app.use(cors());
// Use Webpack middleware
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/index.html"));
});

app.post("/", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});

    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let {video, thumbnail} = files;
        let {title, desc, token, channel} = fields;
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
                let uid = decoded.authResult.user_id;
                let path = `./videos/${uid}/${title}`;
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
                        dbUtils.upload(uid, title, channel, path + `/${video.name}`,
                            path + `/${thumbnail.name}`, new Date(), desc);

                        res.end(JSON.stringify({success: true, message: "Successfully uploaded!"}));
                    });
                });
            });
        }
    });
});

app.post("/api/authenticate", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {username, password} = req.body;
    if ( !username || !password ) {
        res.end(JSON.stringify({
            success: false,
            message: "Fields cannot be empty"
        }));
    }
    else {
        dbUtils.init();
        dbUtils.authenticate(username, password, (err, authResult) => {
            if (err) throw err;

            if (authResult) {
                let token = jwt.sign({authResult}, process.env.SESSION_SECRET, {
                    expiresIn: "1 day"
                });
                res.end(JSON.stringify({
                    success: true,
                    message: "Logged in successfully!",
                    user: {
                        name: authResult.name,
                        username: authResult.username,
                        dp: authResult.dp
                    },
                    token
                }));
            } else
                res.end(JSON.stringify({
                    success: false,
                    message: "Username and password do not match."
                }));
        });
    }
});

app.post("/api/register", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {username, password, name} = req.body;
    if ( !username || !password || !name ) {
        res.end(JSON.stringify({
            success: false,
            message: "Fields cannot be empty"
        }));
    }
    else {
        dbUtils.init();

        dbUtils.register(username, password, name, (e, regResult) => {
            if (e) throw e;

            if (regResult.success) {
                let user = {
                    username,
                    password,
                    name
                };
                let token = jwt.sign(user, process.env.SESSION_SECRET, {
                    expiresIn: "1 day"
                });

                res.end(JSON.stringify({
                    success: regResult.success,
                    message: regResult.message,
                    token
                }));
            } else
                res.end(JSON.stringify(regResult));
        });
    }
});


app.listen(port, (err) => {
    if (err) throw err;
    open("http://localhost:" + port);
});
