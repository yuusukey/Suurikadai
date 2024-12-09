import React from 'react';
import { Link } from 'react-router-dom';

function Yakiniku() {
  return (
    <div>
      <h1>焼肉について</h1>
      <p>焼肉に関する情報をここに表示します。</p>
      <Link to="/">ホーム画面に戻る</Link>
    </div>
  );
}

export default Yakiniku;
