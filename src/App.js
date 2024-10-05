// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Library from './pages/Library';  // Import Library component
import Sample from './pages/Sample';


function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex' }}>
        {/* Sidebar bên trái */}
        <Sidebar />

        {/* Phần hiển thị chức năng bên phải */}
        <div className="content" style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/library" element={<Library />} /> {/* Thêm route Library */}
            <Route path="/sample" element={<Sample />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
