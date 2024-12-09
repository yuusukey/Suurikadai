import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ backgroundColor: '#4CAF50', padding: '10px' }}>
      <nav>
        <Link to="/" style={{ marginRight: '10px', color: 'white', textDecoration: 'none' }}>
          ホーム　
        </Link>
        <Link to="/Yakiniku" style={{ color: 'white', textDecoration: 'none' }}>
          焼肉　
        </Link>
        <Link to="/Menu" style={{ color: 'white', textDecoration: 'none' }}>
          メニュー　
        </Link>
      </nav>
    </header>
  );
}

export default Header;
