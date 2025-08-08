const express = require('express');
const router = express.Router();
const User = require('../models/User')
const ForgotPassword = require('../models/forgot-password')
const jwt = require('jsonwebtoken');

router.get('/create', (req, res) => {
    res.render('create-posts')
})


module.exports = router;