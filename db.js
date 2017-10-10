// Database functions module
import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

let connection;

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

exports.terminate = () => {
    connection.end();
};

exports.authenticate = (username, pwd) => {
    connection.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) throw err;

        if (results.length == 0)
            return false;

        bcrypt.compare(pwd, results[0].pwd, (e, res) => {
            if (e) throw e;
            if (!res) return false;
            return results[0];
        });
    });
};

module.exports = exports;
