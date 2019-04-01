const mysql = require('mysql');

const con = mysql.createConnection({
  host: "//.//.//.///",
  user: "root",
  password: "password",
  database: "nqhs"
});

module.exports = con
