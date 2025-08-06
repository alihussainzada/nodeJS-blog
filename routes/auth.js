const express = require('express');
const router = express.Router();
const User = require('../models/User')
const ForgotPassword = require('../models/forgot-password')
const jwt = require('jsonwebtoken');
const { READUNCOMMITTED } = require('sequelize/lib/table-hints');
const crypto = require('crypto');

function generateStrongToken() {
  return crypto.randomBytes(32).toString('hex');
}


const secret_key = "supersecretkey"
router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', async (req, res)=> {
    const { name, lastname, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.render('register', {error: "The email is already registered!!"})
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

router.get('/logout', (reg, res) => {
  res.clearCookie('token'); // Clears the token cookie
  res.redirect('/auth/login'); // Redirect to login page
})

router.get('/forgot-password', async (req, res) => {
  res.render('forgot-password')
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('forgot-password', { error: 'User not found' });
    }

    // Generate a unique token
    const token = await generateStrongToken();

    // Save the token associated with the user's email
    await ForgotPassword.create({
      email,
      token,
    });

    // TODO: send reset password email with token link here

    res.render('forgot-password', { success: `If your email exists in our system, a reset link has been sent. Token: ${token}` });

  } catch (error) {
    console.error(error);
    res.render('forgot-password', { error: 'Internal server error' });
  }
});

module.exports = router;