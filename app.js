const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');

// Connect to MongoDB once, here
mongoose.connect('mongodb://localhost:27017/testingthedatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

////////////////////////////////////////////ROUTES////////////////////////////////////////////

// Create a new user
app.get('/create', async (req, res) => {
  try {
    const user = await userModel.create({
      username: 'testuser',
      email: 'test@gmail.com',
      age: 25,
    });
    res.send(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post and associate it with an existing user
app.get('/post/create', async (req, res) => {
  try {
    const user = await userModel.findOne(); // Fetch first available user
    if (!user) return res.status(404).send('No user found');

    const post = await postModel.create({
      postData: 'This is a test post',
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();

    res.json({ post, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
