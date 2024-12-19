import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  // 新規追加用のフォーム状態
  const [newName, setNewName] = useState('');
  const [newCookingTime, setNewCookingTime] = useState('');
  const [newSatiety, setNewSatiety] = useState('');
  const [newSatisfaction, setNewSatisfaction] = useState('');
  const [newVitamins, setNewVitamins] = useState('');
  const [newFatContent, setNewFatContent] = useState('');
  const [newNutritionValue, setNewNutritionValue] = useState('');

  // 編集用の状態
  const [editItemId, setEditItemId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCookingTime, setEditCookingTime] = useState('');
  const [editSatiety, setEditSatiety] = useState('');
  const [editSatisfaction, setEditSatisfaction] = useState('');
  const [editVitamins, setEditVitamins] = useState('');
  const [editFatContent, setEditFatContent] = useState('');
  const [editNutritionValue, setEditNutritionValue] = useState('');
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [presetName, setPresetName] = useState('');

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

  const fetchPresets = () => {
    axios.get('http://localhost:8000/menu/presets')
      .then(response => setPresets(response.data))
      .catch(error => console.error('プリセット一覧取得中にエラー', error));
  };

  const applyPreset = () => {
    if (!selectedPreset) return;
    axios.post(`http://localhost:8000/menu/apply_preset?name=${selectedPreset}`)
      .then(() => fetchMenu())
      .catch(error => console.error('プリセット適用中にエラー', error));
  };

  const savePreset = () => {
    if (!presetName) {
      alert('プリセット名を入力してください');
      return;
    }

    axios.post(`http://localhost:8000/menu/save_preset?name=${presetName}`)
      .then(response => {
        console.log(response.data.message);
        alert('プリセットが保存されました');
      })
      .catch(error => {
        console.error('プリセット保存中にエラー:', error);
        alert('プリセットの保存に失敗: ' + (error.response?.data?.detail || '不明なエラー'));
      });
  };

  const deletePreset = () => {
    if (!selectedPreset) {
      alert('削除するプリセットを選択してください');
      return;
    }
    const confirmDelete = window.confirm(`'${selectedPreset}' を削除しますか？`);
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8000/menu/delete_preset?name=${selectedPreset}`)
      .then(response => {
        console.log(response.data.message);
        alert('プリセットが削除されました');
        fetchPresets(); // 再取得してUI更新
      })
      .catch(error => {
        console.error('プリセット削除中にエラー:', error);
        alert('プリセットの削除に失敗しました');
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('このアイテムを削除しますか？');
    if (!confirmDelete) {
      return; // キャンセルした場合は処理しない
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
    setEditCookingTime(item.cookingtime);
    setEditSatiety(item.satiety);
    setEditSatisfaction(item.satisfaction);
    setEditVitamins(item.vitamins);
    setEditFatContent(item.fatcontent);
    setEditNutritionValue(item.nutritionvalue);
  };

  const handleEditSave = () => {
    const updatedItem = {
      name: editName,
      cookingtime: Number(editCookingTime),
      satiety: Number(editSatiety),
      satisfaction: Number(editSatisfaction),
      vitamins: editVitamins,
      fatcontent: editFatContent,
      nutritionvalue: editNutritionValue
    };
    axios.put(`http://localhost:8000/menu/${editItemId}`, updatedItem)
      .then(response => {
        console.log('編集成功:', response.data);
        fetchMenu();
        // 編集モード終了とフォーム初期化
        setEditItemId(null);
        setEditName('');
        setEditCookingTime('');
        setEditSatiety('');
        setEditSatisfaction('');
        setEditVitamins('');
        setEditFatContent('');
        setEditNutritionValue('');
      })
      .catch(error => {
        console.error('編集中にエラー:', error);
      });
  };

  const handleAdd = () => {
    const newItem = {
      name: newName,
      cookingtime: Number(newCookingTime),
      satiety: Number(newSatiety),
      satisfaction: Number(newSatisfaction),
      vitamins: newVitamins,
      fatcontent: newFatContent,
      nutritionvalue: newNutritionValue
    };
    axios.post('http://localhost:8000/menu/', newItem)
      .then(response => {
        console.log('追加成功:', response.data);
        fetchMenu();
        // フォームクリア
        setNewName('');
        setNewCookingTime('');
        setNewSatiety('');
        setNewSatisfaction('');
        setNewVitamins('');
        setNewFatContent('');
        setNewNutritionValue('');
      })
      .catch(error => console.error('追加中にエラー:', error));
  };

  return (
    <div>
      <h1>メニュー一覧</h1>
      <div>
        <button onClick={fetchPresets}>プリセット一覧取得</button>
        <select value={selectedPreset} onChange={e => setSelectedPreset(e.target.value)}>
          <option value="">選択してください</option>
          {presets.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={deletePreset}>選択したプリセットを削除</button>
        <button onClick={applyPreset}>適用</button>
      </div>
      <div>
        <input
          value={presetName}
          onChange={e=>setPresetName(e.target.value)}
          placeholder="プリセット名"
        />
        <button onClick={savePreset}>現在のメニューをプリセットとして保存</button>
      </div>

      {/* 新規追加フォーム */}
      <h2>新規メニュー追加</h2>
      <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="名前" />
      <input value={newCookingTime} onChange={e=>setNewCookingTime(e.target.value)} placeholder="焼き時間" type="number" />
      <input value={newSatiety} onChange={e=>setNewSatiety(e.target.value)} placeholder="満腹度" type="number" />
      <input value={newSatisfaction} onChange={e=>setNewSatisfaction(e.target.value)} placeholder="満足度" type="number" />
      <input value={newVitamins} onChange={e=>setNewVitamins(e.target.value)} placeholder="ビタミン" />
      <input value={newFatContent} onChange={e=>setNewFatContent(e.target.value)} placeholder="脂質" />
      <input value={newNutritionValue} onChange={e=>setNewNutritionValue(e.target.value)} placeholder="栄養価" />
      <button onClick={handleAdd}>追加</button>

      {/* 編集フォーム（editItemIdがある時のみ表示） */}
      {editItemId && (
        <div>
          <h2>メニュー編集 (ID: {editItemId})</h2>
          <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="名前" />
          <input value={editCookingTime} onChange={e=>setEditCookingTime(e.target.value)} placeholder="焼き時間" type="number" />
          <input value={editSatiety} onChange={e=>setEditSatiety(e.target.value)} placeholder="満腹度" type="number" />
          <input value={editSatisfaction} onChange={e=>setEditSatisfaction(e.target.value)} placeholder="満足度" type="number" />
          <input value={editVitamins} onChange={e=>setEditVitamins(e.target.value)} placeholder="ビタミン" />
          <input value={editFatContent} onChange={e=>setEditFatContent(e.target.value)} placeholder="脂質" />
          <input value={editNutritionValue} onChange={e=>setEditNutritionValue(e.target.value)} placeholder="栄養価" />
          <button onClick={handleEditSave}>保存</button>
          <button onClick={() => setEditItemId(null)}>キャンセル</button>
        </div>
      )}

      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            {item.name}, 焼き時間: {item.cookingtime}分/皿, 満腹度: {item.satiety}, 満足度: {item.satisfaction}, ビタミン: {item.vitamins}, 脂質: {item.fatcontent}, 栄養価: {item.nutritionvalue}
            <button onClick={() => handleDelete(item.id)}>削除</button>
            <button onClick={() => startEdit(item)}>編集</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
