import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home'; // ホーム画面
import Yakiniku from './pages/Yakiniku'; // 焼肉画面
import Menu from './pages/Menu'; // メニュー画面

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> {/* ホーム画面 */}
          <Route path="/Yakiniku" element={<Yakiniku />} /> {/* 焼肉画面 */}
          <Route path="/Menu" element={<Menu />} /> {/* メニュー画面 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
