import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client'; // Import socket.io-client
import './CreateModel.css'; // Import CSS với tên mới

const CreateModel = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Waiting for progress...');
  const [samples, setSamples] = useState([]);
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Lấy giá trị thanh tiến trình từ localStorage
    const savedProgress = localStorage.getItem('modelProgress');
    const savedMessage = localStorage.getItem('modelMessage');

    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10));
      if (parseInt(savedProgress, 10) === 100) {
        // Nếu tiến trình đã đạt 100%, reset về 0
        localStorage.removeItem('modelProgress');
        localStorage.removeItem('modelMessage');
        setProgress(0);
        setMessage('Waiting for progress...');
      }
    }

    if (savedMessage) {
      setMessage(savedMessage);
    }

    // Gọi API lấy danh sách các mẫu
    fetch('http://127.0.0.1:5000/api/samples')
      .then(response => response.json())
      .then(data => {
        setSamples(data);
      })
      .catch(error => console.error('Error fetching samples:', error));

    const socket = io('http://127.0.0.1:5000'); // Kết nối tới server Socket.io

    socket.on('progress', (data) => {
      setMessage(data.message);
      setProgress(data.progress);

      // Lưu trạng thái vào localStorage
      localStorage.setItem('modelProgress', data.progress);
      localStorage.setItem('modelMessage', data.message);
    });

    return () => {
      socket.disconnect(); // Ngắt kết nối khi component unmount
    };
  }, []);

  const startModelCreation = () => {
    fetch('http://localhost:5000/api/start-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ samples: selectedSamples })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      // Khi tiến trình hoàn tất, xóa trạng thái trong localStorage
      localStorage.removeItem('modelProgress');
      localStorage.removeItem('modelMessage');
      setProgress(0); // Reset lại thanh tiến trình
      setMessage('Waiting for progress...'); // Reset lại thông điệp
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleSelectSample = (id) => {
    if (selectedSamples.includes(id)) {
      setSelectedSamples(selectedSamples.filter(sampleId => sampleId !== id));
    } else {
      setSelectedSamples([...selectedSamples, id]);
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allSampleIds = samples.map(sample => sample.id);
      setSelectedSamples(allSampleIds);
    } else {
      setSelectedSamples([]);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="model-creation-section">
      <h2>Model Creation</h2>

      {/* Hiển thị các sample trong bảng */}
      <table className="sample-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th style={{ width: '50px' }}>STT</th>
            <th>Name</th>
            <th>Code</th>
            <th>Path</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample, index) => (
            <tr key={sample.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedSamples.includes(sample.id)}
                  onChange={() => handleSelectSample(sample.id)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{sample.name}</td>
              <td>{sample.code}</td>
              <td>{sample.path}</td>
              <td>
                <img 
                  src={`http://localhost:5000/get-file?path=${sample.path.replaceAll('\\', '/')}`} 
                  alt={sample.name} 
                  className="sample-image" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phần cố định ở dưới cùng màn hình */}
      <div className="model-creation-footer">
        <button className="model-creation-start-button" onClick={startModelCreation}>
          Start Model Creation
        </button>

        <div className="model-creation-progress">{message}</div>
        <div className="model-creation-progress-bar" style={{ width: '100%', backgroundColor: '#ddd' }}>
          <div className="model-creation-bar" style={{ width: `${progress}%`, height: '30px', backgroundColor: '#4caf50' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CreateModel;
