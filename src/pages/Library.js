import React, { useEffect, useState } from 'react';
import './Libraryold.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { API_VPS } from '../constant/constants';


function Library() {
  const [trafficSigns, setTrafficSigns] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [newSign, setNewSign] = useState({
    name: '',
    description: '',
    image: null,
  });

  const URL = API_VPS
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const role = localStorage.getItem("role");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300); // 300ms delay to debounce
  
    return () => clearTimeout(handler);
  }, [searchKeyword]);
  
  useEffect(() => {
    const fetchTrafficSigns = async () => {
      try {
        const response = await fetch(`${URL}/api/traffic_signs/search?keyword=${debouncedKeyword}&page=1&page_size=12`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`, // Gắn JWT vào header
            'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
          },
          });
        const data = await response.json();
        setTrafficSigns(data.data || []); // Ensure `data` is properly handled
      } catch (error) {
        console.error('Error fetching traffic signs:', error);
      }
    };
  
    fetchTrafficSigns();
  }, [debouncedKeyword, URL, token]);

  useEffect(() => {
      // Lấy JWT từ localStorage

      fetch(`${API_VPS}/api/traffic_signs`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`, // Gắn JWT vào header
              'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
          },
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => setTrafficSigns(data))
      .catch((error) => console.error('Error fetching traffic signs:', error));
  }, [token]);

  // const handleSignClick = (id) => {
  //   fetch(`${URL}/api/traffic_signs/${id}`, {
  //     credentials: 'include'
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       setSelectedSign(data);
  //       setShowEditForm(false); // Hide edit form when selecting a sign
  //     })
  //     .catch(error => console.error('Error fetching traffic sign details:', error));
  // };

  const handleSignClick = (id) => {
    // Lấy JWT từ localStorage
    const token = localStorage.getItem('accessToken');

    fetch(`${URL}/api/traffic_signs/${id}`, {
        method: 'GET', // Phương thức yêu cầu GET
        headers: {
            'Authorization': `Bearer ${token}`, // Gắn JWT vào header
            'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
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

    fetch(`${URL}/api/traffic_signs`, {
      credentials: 'include',  // Ensures cookies are included in the request
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Gắn JWT vào header
        'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
      },
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
      fetch(`${URL}/api/traffic_signs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Gắn JWT vào header
          'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
        },
        credentials: 'include',
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

    fetch(`${URL}/api/traffic_signs/${id}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`, // Gắn JWT vào header
        'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
      },
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
      <div className="traffic-signs-container">

      <div className="upper-container"> {/* Container mới để kiểm soát layout */}

        <div className="search-container">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search traffic signs..."
            className="search-input"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        </div>

          <div className="traffic-signs-grid">
            {trafficSigns.map(sign => (
              <div key={sign.id} className="traffic-sign-card" onClick={() => handleSignClick(sign.id)}>
                <img src={sign.path} alt={sign.name} />
                <h3>{sign.name}</h3>
                <div className="icon-container">
                {role === "admin" && (

                  <FontAwesomeIcon
                    icon={faEdit}
                    color="dodgerblue"
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateSign(sign.id);
                    }}
                  /> )}
                {role === "admin" && (

                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    color="red"
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSign(sign.id);
                    }}
                  /> )}
                </div>
              </div>
            ))}
          </div>
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
