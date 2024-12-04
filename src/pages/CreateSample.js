import React, { useState, useRef, useEffect } from 'react';
import './CreateSample.css';
import { API_VPS } from '../constant/constants';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng

const CreateSample = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [selectionData, setSelectionData] = useState([]);
  const [file, setFile] = useState(null); // State để lưu file ảnh
  const [trafficSigns, setTrafficSigns] = useState([]); // Thêm state cho dữ liệu API
  const imageRef = useRef(null);
  const selectionBoxRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate(); // Sử dụng để điều hướng về lại trang danh sách sample

  // Gọi API lấy dữ liệu traffic signs
  useEffect(() => {
    fetch(`${API_VPS}/api/traffic_signs`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTrafficSigns(data))
      .catch(error => console.error('Error fetching traffic signs:', error));
  }, [token]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); // Lưu file vào state
    }
  };

  const handleMouseDown = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsSelecting(true);
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.max(e.clientX - rect.left, 0);
    const y = Math.max(e.clientY - rect.top, 0);
    const width = Math.abs(x - startPoint.x);
    const height = Math.abs(y - startPoint.y);
    const left = Math.min(x, startPoint.x);
    const top = Math.min(y, startPoint.y);

    selectionBoxRef.current.style.left = `${left}px`;
    selectionBoxRef.current.style.top = `${top}px`;
    selectionBoxRef.current.style.width = `${width}px`;
    selectionBoxRef.current.style.height = `${height}px`;
    selectionBoxRef.current.style.display = 'block';
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    const rect = imageRef.current.getBoundingClientRect();
    const box = selectionBoxRef.current.getBoundingClientRect();
    const centerX = (((box.left + (box.width / 2)) - rect.left) / rect.width).toFixed(18);
    const centerY = (((box.top + (box.height / 2)) - rect.top) / rect.height).toFixed(18);

    // Tính width và height theo tỷ lệ với kích thước hình ảnh
    const width = (box.width / rect.width).toFixed(18);
    const height = (box.height / rect.height).toFixed(18);

    // Lấy số thứ tự cho vùng chọn mới
    const newLabelIndex = selectionData.length + 1;

    // Tạo id duy nhất cho mỗi vùng chọn
    const selectionId = `selection-${newLabelIndex}`;

    // Tạo một vùng chọn mới
    const selectionDiv = document.createElement('div');
    selectionDiv.classList.add('selected-area');
    selectionDiv.style.left = `${box.left - rect.left}px`;
    selectionDiv.style.top = `${box.top - rect.top}px`;
    selectionDiv.style.width = `${box.width}px`;
    selectionDiv.style.height = `${box.height}px`;
    selectionDiv.setAttribute('id', selectionId); // Thêm id cho phần tử

    // Thêm STT (số thứ tự) vào góc trên bên trái của ô
    const sttSpan = document.createElement('span');
    sttSpan.classList.add('stt-label');
    sttSpan.innerText = newLabelIndex; // Hiển thị số thứ tự

    // Đặt span vào trong vùng chọn
    selectionDiv.appendChild(sttSpan);
    imageRef.current.parentNode.appendChild(selectionDiv);

    const newLabel = { centerX, centerY, width, height, traffic: '', stt: newLabelIndex, id: selectionId };
    setSelectionData([...selectionData, newLabel]);

    selectionBoxRef.current.style.display = 'none';
  };

  const handleDelete = (index) => {
    const updatedSelectionData = [...selectionData];
    const labelToDelete = updatedSelectionData[index];

    // Xóa phần tử DOM dựa trên id
    const elementToRemove = document.getElementById(labelToDelete.id);
    if (elementToRemove) {
      elementToRemove.remove(); // Xóa vùng chọn khỏi DOM
    }

    // Xóa dữ liệu khỏi selectionData
    updatedSelectionData.splice(index, 1);

    // Cập nhật lại STT cho các phần tử còn lại
    updatedSelectionData.forEach((item, idx) => {
      // Cập nhật STT mới
      item.stt = idx + 1;

      // Cập nhật số thứ tự trong DOM
      const elementToUpdate = document.getElementById(item.id);
      if (elementToUpdate) {
        const sttLabel = elementToUpdate.querySelector('.stt-label');
        if (sttLabel) {
          sttLabel.innerText = item.stt; // Cập nhật STT trong giao diện
        }
      }
    });

    setSelectionData(updatedSelectionData);
  };

  const formatNumber = (num) => {
    const formattedNumber = parseFloat(num).toFixed(2);
    return `${formattedNumber}...`; // Thêm dấu "..." sau khi đã giới hạn 2 chữ số thập phân
  };

  const handleSubmit = () => {
    if (!file) {
      alert('Please select an image file first');
      return;
    }
  
    // Chuẩn bị FormData
    const formData = new FormData();
    formData.append('image', file); // Thêm file vào FormData với tên là 'image'
    formData.append('name', file.name); // Thêm tên file vào FormData
  
    // Chuyển đổi selectionData thành dạng labels
    const labels = selectionData.map((data) => {
      const trafficSign = trafficSigns.find(sign => sign.name === data.traffic);
      return {
        centerX: parseFloat(data.centerX),
        centerY: parseFloat(data.centerY),
        height: parseFloat(data.width),
        width: parseFloat(data.height),
        traffic_sign_id: trafficSign ? trafficSign.id : null
      };
    });
    
    formData.append('labels', JSON.stringify(labels)); // Thêm labels vào FormData dưới dạng JSON
  
    // Gửi POST request đến API
    fetch(`${API_VPS}/api/samples`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Data submitted successfully!');
        window.location.reload(); // Refresh lại trang sau khi thành công
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit data');
      });
  };
  

  const handleTrafficChange = (index, value) => {
    const updatedSelectionData = [...selectionData];
    const selectedTraffic = trafficSigns.find(sign => sign.name === value);

    if (selectedTraffic) {
      updatedSelectionData[index].traffic = value;
      updatedSelectionData[index].trafficImage = selectedTraffic.path; // Lưu đường dẫn ảnh
    }

    setSelectionData(updatedSelectionData);
  };

  return (
    <div className="container">
      {/* Nút "Quay lại" */}
      <button className="btn btn-secondary" onClick={() => navigate('/sample')}>
        Back
      </button>

      <input type="file" onChange={handleFileChange} accept="image/*" />
      
      {/* Hiển thị hình ảnh đã chọn */}
      {imagePreviewUrl && (
        <div id="image-container" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <img
            ref={imageRef}
            src={imagePreviewUrl}
            alt="Upload Preview"
            className="img-fluid"
            draggable="false" // Ngăn không cho trình duyệt kéo ảnh
          />
          <div ref={selectionBoxRef} id="selection-box" style={{ display: 'none' }}></div>
        </div>
      )}

      {/* Hiển thị bảng vùng chọn */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Index</th>
              <th>Center X</th>
              <th>Center Y</th>
              <th>Width</th>
              <th>Height</th>
              <th style={{ width: '150px' }}>Traffic</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectionData.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td title={data.centerX}>{formatNumber(data.centerX)}</td>
                <td title={data.centerY}>{formatNumber(data.centerY)}</td>
                <td title={data.width}>{formatNumber(data.width)}</td>
                <td title={data.height}>{formatNumber(data.height)}</td>
                <td>
                  <select value={data.traffic} onChange={(e) => handleTrafficChange(index, e.target.value)}>
                    <option value="">Chọn biển báo</option>
                    {trafficSigns.map((sign) => (
                      <option key={sign.id} value={sign.name}>
                        {sign.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {data.trafficImage && (
                    <img src={data.trafficImage} alt="Traffic Sign" style={{ width: '40px', height: 'auto' }} />
                  )}
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nút Submit */}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Data
      </button>
    </div>
  );
};

export default CreateSample;
