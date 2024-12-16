import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // バックエンドAPIからメニューを取得する
    axios.get('http://localhost:8000/menu') // バックエンドサーバーが8000ポートで起動している想定
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error('メニュー取得中にエラーが発生しました:', error);
      });
  }, []);

  return (
    <div>
      <h1>メニュー一覧</h1>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            {item.name} - ¥{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
