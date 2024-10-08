// // src/pages/Library.js
// import React, { useEffect, useState } from 'react';
// import './Libraryold.css';

// function Library() {
//   const [trafficSigns, setTrafficSigns] = useState([]);
//   const [selectedSign, setSelectedSign] = useState(null); // Lưu trữ biển báo được chọn

//   // Gọi API để lấy danh sách biển báo
//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/api/traffic_signs')
//       .then(response => response.json())
//       .then(data => setTrafficSigns(data))
//       .catch(error => console.error('Error fetching traffic signs:', error));
//   }, []);

//   // Gọi API để lấy chi tiết biển báo
//   const handleSignClick = (id) => {
//     fetch(`http://127.0.0.1:5000/api/traffic_signs/${id}`)
//       .then(response => response.json())
//       .then(data => setSelectedSign(data))
//       .catch(error => console.error('Error fetching traffic sign details:', error));
//   };

//   return (
//     <div className="library-container">
//       <div className="traffic-signs-grid">
//         {trafficSigns.map(sign => (
//           <div key={sign.id} className="traffic-sign-card" onClick={() => handleSignClick(sign.id)}>
//             <img src={sign.path} alt={sign.name} />
//             <h3>{sign.name}</h3>
//           </div>
//         ))}
//       </div>

//       {/* Phần chi tiết biển báo */}
//       {selectedSign && (
//         <div className="traffic-sign-details">
//           <h2>{selectedSign.name}</h2>
//           <img src={selectedSign.path} alt={selectedSign.name} />
//           <p><strong>Code:</strong> {selectedSign.code}</p>
//           <p>{selectedSign.description}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Library;
import React, { useEffect, useState } from 'react';
import './Libraryold.css';

function Library() {
  const [trafficSigns, setTrafficSigns] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null); // Lưu trữ biển báo được chọn
  const [showAddForm, setShowAddForm] = useState(false); // Hiển thị form thêm mới
  const [newSign, setNewSign] = useState({
    name: '',
    description: '',
    image: null
  });

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

  // Tự động tạo mã code từ tên
  const generateCode = (name) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
  };

  // Xử lý khi nhập tên
  const handleNameChange = (e) => {
    const name = e.target.value;
    const code = generateCode(name);
    setNewSign((prevSign) => ({
      ...prevSign,
      name,
      code
    }));
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    setNewSign((prevSign) => ({
      ...prevSign,
      image: e.target.files[0]
    }));
  };

  // Gửi thông tin mới lên server bằng POST và cập nhật danh sách biển báo ngay lập tức
  const handleAddSign = () => {
    const formData = new FormData();
    formData.append('name', newSign.name);
    formData.append('code', generateCode(newSign.name));
    formData.append('description', newSign.description);
    formData.append('image', newSign.image);

    fetch('http://127.0.0.1:5000/api/traffic_signs', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        alert('Traffic sign created successfully');
        // Cập nhật danh sách biển báo mà không cần tải lại trang
        setTrafficSigns(prevSigns => [...prevSigns, data]);
        setShowAddForm(false); // Ẩn form sau khi thêm thành công
      })
      .catch(error => console.error('Error creating traffic sign:', error));
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
      <div className="traffic-sign-details">
        {selectedSign && !showAddForm && (
          <>
            <h2>{selectedSign.name}</h2>
            <img src={selectedSign.path} alt={selectedSign.name} />
            <p><strong>Code:</strong> {selectedSign.code}</p>
            <p>{selectedSign.description}</p>
          </>
        )}

        {/* Nút thêm biển báo mới */}
        <button className="add-sign-form-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Traffic Sign'}
        </button>

        {/* Form thêm biển báo mới (hiển thị khi showAddForm = true) */}
        {showAddForm && (
          <div className="add-sign-form">
            <h2>Add New Traffic Sign</h2>
            <label>Name:</label>
            <input type="text" value={newSign.name} onChange={handleNameChange} />

            <label>Description:</label>
            <textarea value={newSign.description} onChange={(e) => setNewSign((prevSign) => ({ ...prevSign, description: e.target.value }))} />

            <label>Image:</label>
            <input type="file" onChange={handleFileChange} />

            <button onClick={handleAddSign}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;

