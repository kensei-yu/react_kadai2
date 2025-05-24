import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [date, setDate] = useState('');
  const [sortByChecked, setSortByChecked] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [subInput, setSubInput] = useState(''); // サブTODO入力
  const [activeParentIndex, setActiveParentIndex] = useState(null); // サブ追加対象

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { text: input, date, checked: false, subTasks: [] }]);
    setInput('');
    setDate('');
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    const todo = newTodos[index];
    const newChecked = !todo.checked;
    todo.checked = newChecked;
    // 親をチェックした場合、サブも連動
    if (todo.subTasks.length > 0) {
      todo.subTasks = todo.subTasks.map((sub) => ({ ...sub, checked: newChecked }));
    }
    setTodos(newTodos);
  };

  const toggleSubTodo = (parentIndex, subIndex) => {
    const newTodos = [...todos];
    const parent = newTodos[parentIndex];
    parent.subTasks[subIndex].checked = !parent.subTasks[subIndex].checked;

    // 全部チェックされてたら親もチェック
    const allChecked = parent.subTasks.every((s) => s.checked);
    parent.checked = allChecked;

    setTodos(newTodos);
  };

  const addSubTask = () => {
    if (subInput.trim() === '' || activeParentIndex === null) return;
    const newTodos = [...todos];
    newTodos[activeParentIndex].subTasks.push({ text: subInput, checked: false });
    setTodos(newTodos);
    setSubInput('');
    setActiveParentIndex(null);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const sortedTodos = () => {
    let result = [...todos];
    if (sortByChecked) result.sort((a, b) => a.checked - b.checked);
    if (sortByDate)
      result.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
      });
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
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ marginLeft: 10 }} />
      <button onClick={addTodo}>追加</button>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setSortByChecked(!sortByChecked)}>
          チェック並び替え: {sortByChecked ? 'ON' : 'OFF'}
        </button>
        <button onClick={() => setSortByDate(!sortByDate)} style={{ marginLeft: 10 }}>
          日付並び替え: {sortByDate ? 'ON' : 'OFF'}
        </button>
      </div>

      <ul style={{ marginTop: 20 }}>
        {sortedTodos().map((todo, index) => (
          <li key={index} style={{ marginBottom: 10 }}>
            <div
              onClick={() => toggleTodo(index)}
              style={{
                cursor: 'pointer',
                textDecoration: todo.checked ? 'line-through' : 'none',
                color: todo.checked ? 'gray' : 'black',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                {todo.text}（{todo.date || '日付なし'}）
              </span>
              <div>
                <button onClick={() => setActiveParentIndex(index)}>＋サブ</button>
                <button onClick={() => deleteTodo(index)} style={{ marginLeft: 5 }}>
                  削除
                </button>
              </div>
            </div>

            {/* サブTODOリスト */}
            <ul style={{ marginLeft: 20 }}>
              {todo.subTasks &&
                todo.subTasks.map((sub, subIdx) => (
                  <li
                    key={subIdx}
                    onClick={() => toggleSubTodo(index, subIdx)}
                    style={{
                      cursor: 'pointer',
                      textDecoration: sub.checked ? 'line-through' : 'none',
                      color: sub.checked ? 'gray' : 'black',
                    }}
                  >
                    ┗ {sub.text}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* サブTODO追加フォーム */}
      {activeParentIndex !== null && (
        <div style={{ marginTop: 20 }}>
          <input
            type="text"
            value={subInput}
            onChange={(e) => setSubInput(e.target.value)}
            placeholder="サブTODOを入力"
          />
          <button
  onClick={(e) => {
    e.stopPropagation();
    setActiveParentIndex(index);
  }}
>
  ＋サブ
</button>
<button
  onClick={(e) => {
    e.stopPropagation();
    deleteTodo(index);
  }}
  style={{ marginLeft: 5 }}
>
  削除
</button>
        </div>
      )}
    </div>
  );
}

export default App;