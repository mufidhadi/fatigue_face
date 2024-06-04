const mysql = require('mysql');

const MYSQLcon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "face_fatigue"
});
exports.MYSQLcon = MYSQLcon;
