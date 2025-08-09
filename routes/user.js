const express = require('express');
const router = express.Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto');
const secret_key = "supersecretkey"
const path = require('path')
function generateStrongToken() {
  return crypto.randomBytes(32).toString('hex');
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'static/images/'); // folder to save uploaded files
  },
  filename: function(req, file, cb) {
    // Save with original name + current timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/profile', async (req, res)=>{
    const {token} = req.cookies;
    if (!token) {
      res.redirect('/auth/login')
    }
    else{
      if (token){
        const decoded = jwt.verify(token, secret_key);
        console.log(decoded)
        const user = decoded;
        res.render('profile', {user})
        console.log(user)
      }
    }
})

router.post('/edit-profile', async (req, res) => {
  const { name, lastname, currentPassword, newPassword, confirmNewPassword, action } = req.body;
  const { token } = req.cookies;

  if (!token) return res.redirect('/auth/login');

  let decodedUser;
  try {
    decodedUser = jwt.verify(token, secret_key);
  } catch {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({ where: { email: decodedUser.email } });
    console.log(user)
    if (!user) return res.render('edit-profile', { error: 'User not found' });

    if (action === 'updateName') {
      user.name = name;
      user.lastname = lastname;
      await user.save();  // Make sure to save the instance!
    //   return res.redirect('/user/profile');
      return res.render('profile', { success: 'Name updated!', user });
    }
    
    if (action === 'changePassword') {
      if (user.password !== currentPassword) {
        return res.render('edit-profile', { error: 'Current password incorrect', user: req.body });
      }
      if (newPassword !== confirmNewPassword) {
        return res.render('edit-profile', { error: 'New passwords do not match', user: req.body });
      }
      user.password = newPassword;
      await user.save();

      return res.render('edit-profile', { success: 'Password changed!', user });
    }

    res.render('edit-profile', { error: 'Invalid action', user: req.body });
  } catch (err) {
    console.error(err);
    res.render('edit-profile', { error: 'Something went wrong', user: req.body });
  }
});
router.get('/edit-profile', async (req, res) => {
  const {token} = req.cookies;
    if (!token) {
      res.redirect('/auth/login')
    }
    else{
      if (token){
        const decoded = jwt.verify(token, secret_key);
        const dbtoken = await User.findOne({ where: { email: decoded.email } });
        const user = dbtoken;
        res.render('edit-profile', {user})
      }
    }
})

router.post('/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const { token } = req.cookies;
    if (!token) {
      return res.redirect('/auth/login');
    }

    const decodedUser = jwt.verify(token, secret_key);
    const user = await User.findOne({ where: { email: decodedUser.email } });

    if (!user) {
      return res.redirect('/auth/login');
    }

    // Save relative path or filename, better store filename only
    user.profilePicture = req.file.filename; 
    await user.save();
    return res.redirect('/user/edit-profile');

  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});


module.exports = router;
