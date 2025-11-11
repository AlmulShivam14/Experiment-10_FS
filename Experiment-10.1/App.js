// App.js
import React, { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:5000/todos");
    setTodos(await res.json());
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    setInput(""); fetchTodos();
  };

  const updateTodo = async (id, completed) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async id => {
    await fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Todo App</h2>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                flex: 1,
                cursor: "pointer"
              }}
              onClick={() => updateTodo(todo._id, todo.completed)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
