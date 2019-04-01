const express = require('express');
const router = express.Router();
const con = require('../functions/sql');


router.get('/:cc/:cname', (req, res, next) => {
	con.connect(function(err) {
		const data = con.query("SELECT * FROM courses WHERE classcode='" + req.params.cc + "'", function (err, courses, fields) {
			const data2 = con.query("SELECT * FROM courses WHERE name='" + req.params.cname + "'", function (err, cDetails, fields) {
				const data3 = con.query("SELECT * FROM runs WHERE course='" + req.params.cname + "' AND username='" + req.cookies.userData.username + "' ORDER BY -id", function (err, runs, fields) {
			res.render('board', { title: 'Board', req, res, courses, cDetails, runs })
				});
			});
		});
	});
});

module.exports = router;
