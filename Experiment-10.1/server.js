// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/tododb', { useNewUrlParser: true });

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});
const Todo = mongoose.model('Todo', TodoSchema);

// CRUD Endpoints
app.get('/todos', async (req, res) => { res.json(await Todo.find()); });
app.post('/todos', async (req, res) => {
  const todo = new Todo({ text: req.body.text, completed: false });
  await todo.save();
  res.json(todo);
});
app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});
app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ status: 'Deleted' });
});

app.listen(5000, () => console.log("Server running on port 5000"));
