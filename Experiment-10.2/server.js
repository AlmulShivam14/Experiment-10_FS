const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/blogdb');

const SECRET = "YOUR_SECRET_KEY";

// Models
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bio: String,
  avatar: String
});
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Auth Routes
app.post('/api/signup', async (req, res) => {
  const { username, email, password, bio, avatar } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hash, bio, avatar });
  await user.save();
  res.json({ message: "Signup successful" });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, SECRET);
    res.json({ token, user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Profile
app.get('/api/profile', verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

// Posts
app.post('/api/posts', verifyToken, async (req, res) => {
  const post = new Post({ ...req.body, author: req.userId });
  await post.save();
  res.json(post);
});
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().populate('author');
  res.json(posts);
});
app.put('/api/posts/:id', verifyToken, async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
});
app.delete('/api/posts/:id', verifyToken, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

// Comments
app.post('/api/posts/:id/comments', verifyToken, async (req, res) => {
  const comment = new Comment({ post: req.params.id, author: req.userId, text: req.body.text });
  await comment.save();
  res.json(comment);
});
app.get('/api/posts/:id/comments', async (req, res) => {
  const comments = await Comment.find({ post: req.params.id }).populate('author');
  res.json(comments);
});

app.listen(5000, () => console.log("Server running on port 5000"));
