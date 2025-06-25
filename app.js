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
const jwt = require('jsonwebtoken');

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

    let token = jwt.sign({email}, "secretkey")
    res.cookie('token', token);

    res.send(createdUser);
});
  })
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
    let user = await userModel.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).send('something went found');
    }
    
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        res.send(result ? 'Login successful' : 'Invalid credentials');
    })
       
})   

app.get('/logout', (req, res) => {
  res.cookie('token', "");
  res.redirect('/');
});




app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});