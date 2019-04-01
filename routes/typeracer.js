const express = require('express');
const router = express.Router();
const con = require('../functions/sql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

router.get('/', (req, res, next) => {
			res.render('typeracer', { title: 'TypeRacer', req, res })
});

module.exports = router;
