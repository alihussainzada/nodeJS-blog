const express = require('express');
const router = express.Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const secret_key = "supersecretkey"
router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', async (req, res)=> {
    const { name, lastname, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send('Email already registered.');
  }

  // Create new user
  await User.create({
    name,
    lastname,
    email,
    password
  });

  res.redirect('/auth/login');
})
router.get('/login', async (req, res)=>{
    res.render('login')
})
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('login', { error: 'User not found' });
    }
    console.log(user)
    // Check if password matches
    const match = password === user.password;
    if (!match) {
      return res.render('login', { error: 'Incorrect email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret_key,
      { expiresIn: '1h' }
    );

    // Set token as a cookie
    res.cookie('token', token, { httpOnly: true });

    // Redirect to profile
    res.render('profile', {user});
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Something went wrong' });
  }
});

router.get('/profile', async (req, res)=>{
    // res.render('profile', {token})
    res.send("hi")
})


module.exports = router;