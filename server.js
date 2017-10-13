import cors from "cors";
import express from "express";
import path from "path";
import open from "open";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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

app.post("/api/authenticate", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {username, password} = req.body;
    dbUtils.init();
    let authResult = dbUtils.authenticate(username, password);

    if (authResult) {
        let token = jwt.sign(authResult, process.env.SESSION_SECRET, {
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
    dbUtils.terminate();
});

app.post("/register", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let {username, password, name} = req.body;
    dbUtils.init();

    let regResult = dbUtils.register(username, password, name);

    if (regResult) {
        let token = jwt.sign(regResult, process.env.SESSION_SECRET, {
            expiresIn: "1 day"
        });
        res.end(JSON.stringify({
            success: true,
            message: "Logged in successfully!",
            user: {
                name: regResult.name,
                username: regResult.username,
                dp: regResult.dp
            },
            token
        }));
    } else
        res.end(JSON.stringify({
            success: false,
            message: "Invalid Username."
        }));
    dbUtils.terminate();
});


app.listen(port, (err) => {
    if (err) throw err;
    open("http://localhost:" + port);
});
