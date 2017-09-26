import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
    entry: [
        path.resolve(__dirname, "src/index")
    ],
    output: {
        path: path.resolve(__dirname, "src"),
        publicPath: "/",
        filename: "bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inject: true
        })
    ],
    module: {
        loaders: [
            {test: /\.jsx$/, exclude: /node_modules/, loaders: ["babel-loader"]},
            {test: /\.js$/, exclude: /node_modules/, loaders: ["babel-loader"]},
            {test: /\.css$/, loaders: ["style-loader","css-loader"]},
            {test: /\.sass$/, loaders: ["style-loader", "css-loader", "sass-loader"]}
        ]
    }
};
