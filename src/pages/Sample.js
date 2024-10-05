import React, { useEffect, useState, useRef } from 'react';
import './Sample.css'; // Import file CSS

const Sample = () => {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const canvasRef = useRef(null);

  // Gọi API để lấy danh sách samples
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/samples')
      .then((response) => response.json())
      .then((data) => setSamples(data))
      .catch((error) => console.error('Error fetching samples:', error));
  }, []);

  // Khi bấm vào một ô, lấy chi tiết sample theo id
  const handleSampleClick = (id) => {
    fetch(`http://127.0.0.1:5000/api/samples/${id}`)
      .then((response) => response.json())
      .then((data) => setSelectedSample(data))
      .catch((error) => console.error('Error fetching sample details:', error));
  };

  useEffect(() => {
    if (selectedSample) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
  
      img.src = `http://127.0.0.1:5000${selectedSample.path.replaceAll('\\', '/')}`;
  
      img.onload = () => {
        // Đặt kích thước canvas theo kích thước ảnh
        canvas.width = img.width;
        canvas.height = img.height;
      
        // Kiểm tra kích thước ảnh và canvas
        console.log(`Image Width: ${img.width}, Image Height: ${img.height}`);
        console.log(`Canvas Width: ${canvas.width}, Canvas Height: ${canvas.height}`);
      
        // Xóa canvas trước khi vẽ
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        // Vẽ ảnh lên canvas
        ctx.drawImage(img, 0, 0);
      
        // Tiếp tục với các bước vẽ hình chữ nhật
        selectedSample.labels.forEach((label, index) => {
          const { centerX, centerY, width, height } = label;
        
          // Chuyển đổi tỷ lệ sang pixel
          const x_center_px = centerX * canvas.width;
          const y_center_px = centerY * canvas.height;
          const w_px = width * canvas.width * 0.35;
          const h_px = height * canvas.height * 2.3;
        
          // Tính toán tọa độ góc trên bên trái của hình chữ nhật
          const x_min = x_center_px - w_px / 2;
          const y_min = y_center_px - h_px / 2;
        
          // In ra các giá trị tính toán
          console.log(`Label ${label.id}:`);
          console.log(`  Center X (px): ${x_center_px}`);
          console.log(`  Center Y (px): ${y_center_px}`);
          console.log(`  Width (px): ${w_px}`);
          console.log(`  Height (px): ${h_px}`);
          console.log(`  X Min: ${x_min}`);
          console.log(`  Y Min: ${y_min}`);
        
          // Vẽ hình chữ nhật lên canvas
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 1;
          ctx.strokeRect(x_min, y_min, w_px, h_px);
        
          // Vẽ số thứ tự vào bên trong hình chữ nhật
          ctx.fillStyle = 'white'; // Màu chữ
          ctx.font = '12px Arial'; // Kích thước và kiểu chữ
          ctx.fillText(index + 1, x_min, y_min); // Vẽ số thứ tự, điều chỉnh tọa độ nếu cần
        });
        
      };
      
    }
  }, [selectedSample]);
  
  
  
  

  return (
    <div className="sample-container">
      {/* Phần hiển thị chi tiết */}
      {selectedSample ? (
        <div className="sample-details">
          <h2>Name: {selectedSample.name}</h2>
          <p><strong>Code:</strong> {selectedSample.code}</p>
          <img
            src={`http://127.0.0.1:5000${selectedSample.path.replaceAll('\\', '/')}`} // Sửa đường dẫn
            alt={selectedSample.name}
            style={{ display: 'none' }} // Ảnh gốc sẽ không hiển thị
          />
          <canvas ref={canvasRef} />

          {/* Hiển thị bảng chi tiết của labels */}
          <h3>Label Details</h3>
          <div className="label-table-container">
            <table className="label-table" border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>STT</th>
                  <th className="small-column">Center X</th>
                  <th className="small-column">Center Y</th>
                  <th className="small-column">Height</th>
                  <th className="small-column">Width</th>
                  <th className="traffic-sign-column">Traffic Sign Name</th>
                  <th className="description-column">Description</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {selectedSample.labels.map((label, index) => (
                  <tr key={label.id}>
                    <td>{index + 1}</td>
                    <td className="small-column overflow" title={label.centerX}>{label.centerX.toFixed(2)}...</td>
                    <td className="small-column overflow" title={label.centerY}>{label.centerY.toFixed(2)}...</td>
                    <td className="small-column overflow" title={label.height}>{label.height.toFixed(2)}...</td>
                    <td className="small-column overflow" title={label.width}>{label.width.toFixed(2)}...</td>
                    <td>{label.traffic_sign.name}</td>
                    <td className="description-column" title={label.traffic_sign.description}>{label.traffic_sign.description}</td>
                    <td>
                      <img
                        src={label.traffic_sign.path}
                        alt={label.traffic_sign.name}
                        style={{ width: '50px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="sample-details">
          <h2>Select a Sample</h2>
        </div>
      )}

      {/* Cột hiển thị hình ảnh của tất cả samples */}
      <div className="samples-grid">
        {samples.map((sample) => (
          <div
            key={sample.id}
            className="sample-card"
            onClick={() => handleSampleClick(sample.id)}
          >
            <img
              src={`http://127.0.0.1:5000${sample.path.replaceAll('\\', '/')}`} // Sửa đường dẫn
              alt={sample.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sample;
