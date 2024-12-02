import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home'; // ホーム画面
import Yakiniku from './pages/yakiniku'; // 焼肉画面

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> {/* ホーム画面 */}
          <Route path="/about" element={<Yakiniku />} /> {/* 焼肉画面 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
