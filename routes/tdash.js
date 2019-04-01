const express = require('express');
const router = express.Router();
const con = require('../functions/sql');


function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

router.get('/', (req, res, next) => {

	if (req.cookies.userData == null) {
		res.redirect('/login');
	}
	else {
	con.connect(function(err) {
		const data = con.query("SELECT * FROM users WHERE username='" + req.cookies.userData.username + "'", function (err, result, fields) {
			const data2 = con.query("SELECT * FROM courses WHERE classcode='" + result[0].classcode + "' ORDER BY sort", function (err, courses, fields) {
						const data3 = con.query("SELECT * FROM runs WHERE classcode='" + result[0].classcode + "' ORDER BY -id", function (err, runs, fields) {
							const data4 = con.query("SELECT * FROM users WHERE classcode='" + result[0].classcode + "' ORDER BY -wpm", function (err, wpmlist, fields) {
								const data5 = con.query("SELECT * FROM users WHERE classcode='" + result[0].classcode + "' ORDER BY -accuracy", function (err, acclist, fields) {
			res.render('tdash', { title: 'Teacher Dashboard',req, res, courses, result, runs, msToTime, wpmlist, acclist })
						});
					});
				});
			});
		});
	});
}
});

module.exports = router;
