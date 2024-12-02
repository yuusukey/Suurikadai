import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div>
      <h1>メニュー一覧</h1>
      <p>焼き肉のメニュー一覧</p>
      <Link to="/">ホーム画面に戻る</Link>
    </div>
  );
}

export default Menu;
