import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>焼き肉食べ放題</h1>
      <p>効率よく幸せになろう！</p>
      <Link to="/about">次の画面へ</Link>
    </div>
  );
}

export default Home;
