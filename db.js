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

exports.register = (username, pwd, name) => {
    connection.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        // First check if user exists already.
        if (err) throw err;

        if (!results.length)
            return {
                success: false,
                message: "Username already exists."
            };
    });

    // Gotta hash the password first!
    bcrypt.hash(pwd, 10, (e_, hash) => {
        if (e_) throw e_;

        connection.query("INSERT INTO users (name, username, pwd) VALUES (?, ?, ?)", [name, username, hash], (err, results) => {
            if (err) {
                // Can't simply throw an error here, return an error message instead.
                return {
                    success: false,
                    message: "Unknown error occurred, try again."
                };
            }

            // No error, inserted successfully, so return true.
            return {
                success: true,
                message: "Successfully registered!"
            };
        });
    });
};

module.exports = exports;
