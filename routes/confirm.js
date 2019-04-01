const express = require('express');
const router = express.Router();
const con = require('../functions/sql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

router.get('/', (req, res, next) => {
			res.render('confirm', { title: 'Results of Match', req, res })
});

module.exports = router;
