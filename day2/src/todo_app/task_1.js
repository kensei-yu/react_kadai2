import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { text: input, checked: false }]);
    setInput('');
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].checked = !newTodos[index].checked;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>TODOアプリ</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="新しいTODOを入力"
      />
      <button onClick={addTodo}>追加</button>

      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            style={{
              cursor: 'pointer',
              textDecoration: todo.checked ? 'line-through' : 'none',
              color: todo.checked ? 'gray' : 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '5px',
            }}
          >
            <span onClick={() => toggleTodo(index)} style={{ flex: 1 }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(index)} style={{ marginLeft: 10 }}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;