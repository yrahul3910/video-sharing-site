import cors from "cors";
import express from "express";
import path from "path";
import open from "open";
import compression from "compression";

// Used for transpiling
import webpack from "webpack";
import config from "./webpack.config";

const port = 8000;
const app = express();
const compiler = webpack(config);

// gzip files
app.use(compression());
app.use(cors());
// Use Webpack middleware
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.get("/*", (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.post("/api/authenticate", (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({
        success: false,
        message: "This isn't ready yet!"
    }));
});

app.listen(port, (err) => {
    if (err) throw err;
    open("http://localhost:" + port);
});
