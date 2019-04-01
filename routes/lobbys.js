const express = require('express');
const router = express.Router();
const con = require('../functions/sql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');


router.get('/', (req, res, next) => {
	con.connect(function(err) {
		const data = con.query("SELECT * FROM lobbys ORDER BY id", function (err, lobbys, fields) {
			res.render('lobbys', { title: 'TypeRacer Lobbys', req, res, lobbys })
		});
	});
});

module.exports = router;
