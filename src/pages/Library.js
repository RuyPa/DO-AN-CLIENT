// src/pages/Library.js
import React, { useEffect, useState } from 'react';
import './Library.css';

function Library() {
  const [trafficSigns, setTrafficSigns] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null); // Lưu trữ biển báo được chọn

  // Gọi API để lấy danh sách biển báo
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/traffic_signs')
      .then(response => response.json())
      .then(data => setTrafficSigns(data))
      .catch(error => console.error('Error fetching traffic signs:', error));
  }, []);

  // Gọi API để lấy chi tiết biển báo
  const handleSignClick = (id) => {
    fetch(`http://127.0.0.1:5000/api/traffic_signs/${id}`)
      .then(response => response.json())
      .then(data => setSelectedSign(data))
      .catch(error => console.error('Error fetching traffic sign details:', error));
  };

  return (
    <div className="library-container">
      <div className="traffic-signs-grid">
        {trafficSigns.map(sign => (
          <div key={sign.id} className="traffic-sign-card" onClick={() => handleSignClick(sign.id)}>
            <img src={sign.path} alt={sign.name} />
            <h3>{sign.name}</h3>
          </div>
        ))}
      </div>

      {/* Phần chi tiết biển báo */}
      {selectedSign && (
        <div className="traffic-sign-details">
          <h2>{selectedSign.name}</h2>
          <img src={selectedSign.path} alt={selectedSign.name} />
          <p><strong>Code:</strong> {selectedSign.code}</p>
          <p>{selectedSign.description}</p>
        </div>
      )}
    </div>
  );
}

export default Library;
