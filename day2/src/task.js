import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { newFunction } from './todo_app/task_1';

//過去に作ったやつを参考にしてるのでちょっと変かも

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // 起動時にlocalStorageから読むやつ
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    const newTodo = {
      id: Date.now(), 
      text: input,
      completed: false,
    };
    setTodos(prev => [...prev, newTodo]);
    setInput(''); // 入力欄リセット
  };

  const toggleComplete = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

    return (
      <div className="container">
        <h1>TODOアプリ</h1>
  
        <div className="inputArea">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="やることを入力"
            className="input"
          />
          <button onClick={handleAddTodo} className="addButton">追加</button>
        </div>
  
        <ul className="todoList">
          {todos.map(todo => (
            <li key={todo.id} className="todoItem">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
export default App;
