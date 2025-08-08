const express = require('express')
const app = express()
const sequelize = require('./database/db_connection')
const User = require('./models/User')
const path = require('path');
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
const port = 3000
app.set('view engine', 'ejs'); // use ejs
app.set('views', path.join(__dirname, 'views')); // views folder
app.use(express.urlencoded({ extended: true })); // for form data
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render('home', { blogs, user: req.user || null });
})

// app.get('/create-user', async (req, res) => {
//     const user = await User.create({
//     name: 'Ali Hussainzada',
//     email: 'ali@example.com',
//     password: 'ALIali110@' // In real apps, hash the password!
//     });
//         res.status(201).json({ message: 'User created successfully', user: user.toJSON() });
// })

app.use('/auth', authRoute)
app.use('/posts', postsRoute)
app.listen(port, async () => {
try {

sequelize.sync({ force: false }) 
  .then(() => {
    console.log('✅ Database synced successfully.');
  })
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
  console.log(`Example app listening on port ${port}`)
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
})
