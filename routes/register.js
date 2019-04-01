const express = require('express');
const router = express.Router();
const con = require('../functions/sql');


router.get('/', (req, res, next) => {
			res.render('register', { title: 'Register', req, res})
});

module.exports = router;
