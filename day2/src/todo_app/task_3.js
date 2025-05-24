import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [date, setDate] = useState('');
  const [sortByChecked, setSortByChecked] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);

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
    setTodos([...todos, { text: input, checked: false, date }]);
    setInput('');
    setDate('');
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

  const sortedTodos = () => {
    let result = [...todos];
    if (sortByChecked) {
      result = result.sort((a, b) => a.checked - b.checked);
    }
    if (sortByDate) {
      result = result.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
      });
    }
    return result;
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
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginLeft: 10 }}
      />
      <button onClick={addTodo}>追加</button>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setSortByChecked(!sortByChecked)}>
          チェック並び替え: {sortByChecked ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setSortByDate(!sortByDate)}
          style={{ marginLeft: 10 }}
        >
          日付並び替え: {sortByDate ? 'ON' : 'OFF'}
        </button>
      </div>

      <ul style={{ marginTop: 20 }}>
        {sortedTodos().map((todo, index) => (
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
              {todo.text}（{todo.date || '日付なし'}）
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