const express = require('express');
const router = express.Router();
const con = require('../functions/sql');


router.get('/', (req, res, next) => {
	con.connect(function(err) {
		const data = con.query("SELECT * FROM users ORDER BY -wpm", function (err, result, fields) {
			const data2 = con.query("SELECT * FROM classes ORDER BY -runs", function (err3, classes, fields) {
				console.log(classes)
				console.log(err3)
			res.render('index', { title: 'Home', req , res, result, classes })
			});
		});
	});
});

module.exports = router;
