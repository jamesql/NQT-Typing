const mysql = require('mysql');

const con = mysql.createConnection({
  host: "73.167.233.53",
  user: "root",
  password: "JagroshSucks1337",
  database: "nqhs"
});

module.exports = con