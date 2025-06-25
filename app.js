const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const userModel = require('./models/user'); //model/user.js

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

////////////////////////routes////////////////////////

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/create', (req, res) => {
  let { username, password, email, age } = req.body;

  bcrypt.genSalt(10, async (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({ 
        username, 
        email, 
        age, 
        password: hash,
    });
    res.send(createdUser);
});
  })
});




app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});