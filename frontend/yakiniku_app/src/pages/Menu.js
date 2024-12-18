import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  
  // 新規追加用のフォーム状態
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newSatisfaction, setNewSatisfaction] = useState('');

  // 編集用の状態
  const [editItemId, setEditItemId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSatisfaction, setEditSatisfaction] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    axios.get('http://localhost:8000/menu/')
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error('メニュー取得中にエラーが発生しました:', error);
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('このアイテムを削除しますか？');
    if (!confirmDelete) {
      return; // ユーザーがキャンセルした場合は何もしない
    }
    axios.delete(`http://localhost:8000/menu/${id}`)
      .then(response => {
        console.log('削除成功:', response.data);
        fetchMenu();
      })
      .catch(error => {
        console.error('削除中にエラー:', error);
      });
  };


  const startEdit = (item) => {
    // 編集モードに入るときに現在の値をフォームにセット
    setEditItemId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditSatisfaction(item.satisfaction);
  };

  const handleEditSave = () => {
    const updatedItem = {
      name: editName,
      price: Number(editPrice),
      satisfaction: Number(editSatisfaction)
    };
    axios.put(`http://localhost:8000/menu/${editItemId}`, updatedItem)
      .then(response => {
        console.log('編集成功:', response.data);
        fetchMenu();
        // 編集モード終了
        setEditItemId(null);
        setEditName('');
        setEditPrice('');
        setEditSatisfaction('');
      })
      .catch(error => {
        console.error('編集中にエラー:', error);
      });
  };

  const [newDescription, setNewDescription] = useState('');

  const handleAdd = () => {
    const newItem = {
      name: newName,
      price: Number(newPrice),
      satisfaction: Number(newSatisfaction),
      description: newDescription,  // 新フィールドを追加
      // category: newCategory など他のフィールドも追加可能
    };
    axios.post('http://localhost:8000/menu/', newItem)
      .then(response => {
        console.log('追加成功:', response.data);
        fetchMenu();
        // フォームクリア
        setNewName('');
        setNewPrice('');
        setNewSatisfaction('');
        setNewDescription(''); // 新フィールドもクリア
      })
      .catch(error => console.error('追加中にエラー:', error));
  };
  

  return (
    <div>
      <h1>メニュー一覧</h1>

      {/* 新規追加フォーム */}
      <h2>新規メニュー追加</h2>
      <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="名前" />
      <input value={newPrice} onChange={e=>setNewPrice(e.target.value)} placeholder="価格" type="number" />
      <input value={newSatisfaction} onChange={e=>setNewSatisfaction(e.target.value)} placeholder="満足度" type="number" />
      <input value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="説明" />
      <button onClick={handleAdd}>追加</button>

      {/* 編集フォーム（editItemIdがある時のみ表示） */}
      {editItemId && (
        <div>
          <h2>メニュー編集 (ID: {editItemId})</h2>
          <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="名前" />
          <input value={editPrice} onChange={e=>setEditPrice(e.target.value)} placeholder="価格" type="number" />
          <input value={editSatisfaction} onChange={e=>setEditSatisfaction(e.target.value)} placeholder="満足度" type="number" />
          <button onClick={handleEditSave}>保存</button>
          <button onClick={() => setEditItemId(null)}>キャンセル</button>
        </div>
      )}

      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            {item.name} - ¥{item.price} 満足度: {item.satisfaction}
            <button onClick={() => handleDelete(item.id)}>削除</button>
            <button onClick={() => startEdit(item)}>編集</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
