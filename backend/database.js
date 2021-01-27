"use strict";

const mysql = require("mysql");
require("dotenv").config();

// Create connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

// Connection
connection.connect((err) => {
    if (err) {
        console.log("Connection to db not possible");
        console.log(err);
    } else(console.log("connected to database :)"));
})

module.exports = connection;