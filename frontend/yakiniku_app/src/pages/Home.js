import React from 'react';
import { Link } from 'react-router-dom';

function Example() {
  return (
    <div>
      <h1>焼き肉食べ放題</h1>
      <p>効率よく幸せになろう！</p>
      <Link to="/Yakiniku">焼き肉メニュージェネレーター</Link>
      <br />
      <Link to="/Menu">メニュー一覧</Link>
    </div>
  );
}

export default Example;
