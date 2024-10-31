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
// import React, { useEffect, useState } from 'react';
// import './Libraryold.css';

// function Library() {
//   const [trafficSigns, setTrafficSigns] = useState([]);
//   const [selectedSign, setSelectedSign] = useState(null); // Lưu trữ biển báo được chọn
//   const [showAddForm, setShowAddForm] = useState(false); // Hiển thị form thêm mới
//   const [newSign, setNewSign] = useState({
//     name: '',
//     description: '',
//     image: null
//   });

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

//   // Tự động tạo mã code từ tên
//   const generateCode = (name) => {
//     return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
//   };

//   // Xử lý khi nhập tên
//   const handleNameChange = (e) => {
//     const name = e.target.value;
//     const code = generateCode(name);
//     setNewSign((prevSign) => ({
//       ...prevSign,
//       name,
//       code
//     }));
//   };

//   // Xử lý khi chọn file ảnh
//   const handleFileChange = (e) => {
//     setNewSign((prevSign) => ({
//       ...prevSign,
//       image: e.target.files[0]
//     }));
//   };

//   // Gửi thông tin mới lên server bằng POST và cập nhật danh sách biển báo ngay lập tức
//   const handleAddSign = () => {
//     const formData = new FormData();
//     formData.append('name', newSign.name);
//     formData.append('code', generateCode(newSign.name));
//     formData.append('description', newSign.description);
//     formData.append('image', newSign.image);

//     fetch('http://127.0.0.1:5000/api/traffic_signs', {
//       method: 'POST',
//       body: formData,
//     })
//       .then(response => response.json())
//       .then(data => {
//         alert('Traffic sign created successfully');
//         // Cập nhật danh sách biển báo mà không cần tải lại trang
//         setTrafficSigns(prevSigns => [...prevSigns, data]);
//         setShowAddForm(false); // Ẩn form sau khi thêm thành công
//       })
//       .catch(error => console.error('Error creating traffic sign:', error));
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
//       <div className="traffic-sign-details">
//         {selectedSign && !showAddForm && (
//           <>
//             <h2>{selectedSign.name}</h2>
//             <img src={selectedSign.path} alt={selectedSign.name} />
//             <p><strong>Code:</strong> {selectedSign.code}</p>
//             <p>{selectedSign.description}</p>
//           </>
//         )}

//         {/* Nút thêm biển báo mới */}
//         <button className="add-sign-form-btn" onClick={() => setShowAddForm(!showAddForm)}>
//           {showAddForm ? 'Cancel' : 'Add New Traffic Sign'}
//         </button>

//         {/* Form thêm biển báo mới (hiển thị khi showAddForm = true) */}
//         {showAddForm && (
//           <div className="add-sign-form">
//             <h2>Add New Traffic Sign</h2>
//             <label>Name:</label>
//             <input type="text" value={newSign.name} onChange={handleNameChange} />

//             <label>Description:</label>
//             <textarea value={newSign.description} onChange={(e) => setNewSign((prevSign) => ({ ...prevSign, description: e.target.value }))} />

//             <label>Image:</label>
//             <input type="file" onChange={handleFileChange} />

//             <button onClick={handleAddSign}>Submit</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Library;

// import React, { useEffect, useState } from 'react';
// import './Libraryold.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// function Library() {
//   const [trafficSigns, setTrafficSigns] = useState([]);
//   const [selectedSign, setSelectedSign] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newSign, setNewSign] = useState({
//     name: '',
//     description: '',
//     image: null,
//   });

//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/api/traffic_signs')
//       .then(response => response.json())
//       .then(data => setTrafficSigns(data))
//       .catch(error => console.error('Error fetching traffic signs:', error));
//   }, []);

//   const handleSignClick = (id) => {
//     fetch(`http://127.0.0.1:5000/api/traffic_signs/${id}`)
//       .then(response => response.json())
//       .then(data => setSelectedSign(data))
//       .catch(error => console.error('Error fetching traffic sign details:', error));
//   };

//   const generateCode = (name) => {
//     return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
//   };

//   const handleNameChange = (e) => {
//     const name = e.target.value;
//     const code = generateCode(name);
//     setNewSign((prevSign) => ({
//       ...prevSign,
//       name,
//       code,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setNewSign((prevSign) => ({
//       ...prevSign,
//       image: e.target.files[0],
//     }));
//   };

//   const handleAddSign = () => {
//     const formData = new FormData();
//     formData.append('name', newSign.name);
//     formData.append('code', generateCode(newSign.name));
//     formData.append('description', newSign.description);
//     formData.append('image', newSign.image);

//     fetch('http://127.0.0.1:5000/api/traffic_signs', {
//       method: 'POST',
//       body: formData,
//     })
//       .then(response => response.json())
//       .then(data => {
//         alert('Traffic sign created successfully');
//         setTrafficSigns(prevSigns => [...prevSigns, data]);
//         setShowAddForm(false);
//       })
//       .catch(error => console.error('Error creating traffic sign:', error));
//   };

//   const handleDeleteSign = (id) => {
//     fetch(`http://127.0.0.1:5000/api/traffic_signs/${id}`, {
//       method: 'DELETE',
//     })
//       .then(() => {
//         setTrafficSigns(prevSigns => prevSigns.filter(sign => sign.id !== id));
//         alert('Traffic sign deleted successfully');
//       })
//       .catch(error => console.error('Error deleting traffic sign:', error));
//   };

//   const handleUpdateSign = (id) => {
//     alert(`Update functionality for ID: ${id} is not implemented yet.`);
//   };

//   return (
//     <div className="library-container">
//       <div className="traffic-signs-grid">
//         {trafficSigns.map(sign => (
//           <div key={sign.id} className="traffic-sign-card" onClick={() => handleSignClick(sign.id)}>
//             <img src={sign.path} alt={sign.name} />
//             <h3>{sign.name}</h3>
//             <div className="icon-container">
//               <FontAwesomeIcon
//                 icon={faEdit}
//                 color="dodgerblue"
//                 className="icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleUpdateSign(sign.id);
//                 }}
//               />
//               <FontAwesomeIcon
//                 icon={faTrashAlt}
//                 color="red"
//                 className="icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteSign(sign.id);
//                 }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="traffic-sign-details">
//         {selectedSign && !showAddForm && (
//           <>
//             <h2>{selectedSign.name}</h2>
//             <img src={selectedSign.path} alt={selectedSign.name} />
//             <p><strong>Code:</strong> {selectedSign.code}</p>
//             <p>{selectedSign.description}</p>
//           </>
//         )}

//         <button className="add-sign-form-btn" onClick={() => setShowAddForm(!showAddForm)}>
//           {showAddForm ? 'Cancel' : 'Add New Traffic Sign'}
//         </button>

//         {showAddForm && (
//           <div className="add-sign-form">
//             <h2>Add New Traffic Sign</h2>
//             <label>Name:</label>
//             <input type="text" value={newSign.name} onChange={handleNameChange} />

//             <label>Description:</label>
//             <textarea value={newSign.description} onChange={(e) => setNewSign((prevSign) => ({ ...prevSign, description: e.target.value }))} />

//             <label>Image:</label>
//             <input type="file" onChange={handleFileChange} />

//             <button onClick={handleAddSign}>Submit</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Library;

import React, { useEffect, useState } from 'react';
import './Libraryold.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Library() {
  const [trafficSigns, setTrafficSigns] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newSign, setNewSign] = useState({
    name: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/traffic_signs')
      .then(response => response.json())
      .then(data => setTrafficSigns(data))
      .catch(error => console.error('Error fetching traffic signs:', error));
  }, []);

  const handleSignClick = (id) => {
    fetch(`http://127.0.0.1:5000/api/traffic_signs/${id}`)
      .then(response => response.json())
      .then(data => {
        setSelectedSign(data);
        setShowEditForm(false); // Hide edit form when selecting a sign
      })
      .catch(error => console.error('Error fetching traffic sign details:', error));
  };

  const generateCode = (name) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewSign((prevSign) => ({
      ...prevSign,
      name,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewSign((prevSign) => ({
      ...prevSign,
      image: file,
    }));
  };

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
        setTrafficSigns(prevSigns => [...prevSigns, data]);
        setShowAddForm(false);
        setShowEditForm(false); // Ensure edit form is hidden
        setNewSign({ name: '', description: '', image: null }); // Clear input fields
      })
      .catch(error => console.error('Error creating traffic sign:', error));
  };

  const handleDeleteSign = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this traffic sign?");
    if (confirmDelete) {
      fetch(`http://127.0.0.1:5000/api/traffic_signs/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setTrafficSigns(prevSigns => prevSigns.filter(sign => sign.id !== id));
          alert('Traffic sign deleted successfully');
        })
        .catch(error => console.error('Error deleting traffic sign:', error));
    }
  };

  const handleUpdateSign = (id) => {
    const signToEdit = trafficSigns.find(sign => sign.id === id);
    if (signToEdit) {
      setNewSign({
        name: signToEdit.name,
        description: signToEdit.description,
        image: null,
      });
      setSelectedSign(signToEdit);
      setShowEditForm(true); // Show edit form
      setShowAddForm(false); // Hide add form
    } else {
      console.error("Selected sign is null");
    }
  };

  const handleSaveUpdate = (id) => {
    const formData = new FormData();
    formData.append('name', newSign.name);
    formData.append('code', generateCode(newSign.name));
    formData.append('description', newSign.description);
    if (newSign.image) {
      formData.append('image', newSign.image);
    }

    fetch(`http://127.0.0.1:5000/api/traffic_signs/${id}`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        alert('Traffic sign updated successfully');
        setTrafficSigns(prevSigns => prevSigns.map(sign => (sign.id === id ? data : sign)));
        setShowEditForm(false);
        setSelectedSign(data);
        setNewSign({ name: '', description: '', image: null }); // Clear input fields after edit
      })
      .catch(error => console.error('Error updating traffic sign:', error));
  };

  return (
    <div className="library-container">
      <div className="traffic-signs-grid">
        {trafficSigns.map(sign => (
          <div key={sign.id} className="traffic-sign-card" onClick={() => handleSignClick(sign.id)}>
            <img src={sign.path} alt={sign.name} />
            <h3>{sign.name}</h3>
            <div className="icon-container">
              <FontAwesomeIcon
                icon={faEdit}
                color="dodgerblue"
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateSign(sign.id);
                }}
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="red"
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSign(sign.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="traffic-sign-details">
        {selectedSign && !showAddForm && !showEditForm && (
          <>
            <h2>{selectedSign.name}</h2>
            <img src={selectedSign.path} alt={selectedSign.name} />
            <p><strong>Code:</strong> {selectedSign.code}</p>
            <p>{selectedSign.description}</p>
          </>
        )}

        <button className="add-sign-form-btn" onClick={() => {
          setShowAddForm(!showAddForm);
          setShowEditForm(false); // Ensure edit form is hidden when adding
          setNewSign({ name: '', description: '', image: null }); // Clear inputs when opening add form
        }}>
          {showAddForm ? 'Cancel' : 'Add New Traffic Sign'}
        </button>

        {showAddForm && (
          <div className="edit-sign-form">
            <h2>Add New Traffic Sign</h2>
            <label>Name:</label>
            <input type="text" value={newSign.name} onChange={handleNameChange} />

            <label>Code:</label>
            <input type="text" value={generateCode(newSign.name)} readOnly />

            <label>Description:</label>
            <textarea
              value={newSign.description}
              onChange={(e) => setNewSign((prevSign) => ({ ...prevSign, description: e.target.value }))}
              style={{ height: '100px' }} // Expanded height
            />

            <label>Image:</label>
            <input type="file" onChange={handleFileChange} />

            {newSign.image && (
              <div>
                <h4>Image Preview:</h4>
                <img src={URL.createObjectURL(newSign.image)} alt="Preview" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
              </div>
            )}

            <button onClick={handleAddSign}>Submit</button>
          </div>
        )}

        {showEditForm && (
          <div className="edit-sign-form">
            <h2>Edit Traffic Sign</h2>
            <label>Name:</label>
            <input type="text" value={newSign.name} onChange={handleNameChange} />

            <label>Code:</label>
            <input type="text" value={generateCode(newSign.name)} readOnly />

            <label>Description:</label>
            <textarea
              value={newSign.description}
              onChange={(e) => setNewSign((prevSign) => ({ ...prevSign, description: e.target.value }))}
              style={{ height: '100px' }} // Expanded height
            />

            <label>Original Image:</label>
            {selectedSign && (
              <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                <img 
                  src={selectedSign.path} 
                  alt={selectedSign.name} 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                />
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }} 
                />
              </div>
            )}

            {newSign.image && (
              <div>
                <h4>New Image Preview:</h4>
                <img 
                  src={URL.createObjectURL(newSign.image)} 
                  alt="New Preview" 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                />
              </div>
            )}

            <button onClick={() => handleSaveUpdate(selectedSign.id)}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;
