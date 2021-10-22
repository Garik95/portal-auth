const dbconf = require('../dbconfig');
const mongoose = require("mongoose");

const db = mongoose
    .connect(dbconf.url)
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });

// models
db.Users = require('./user')(mongoose);
db.Tests = require('./test')(mongoose);

module.exports = db;