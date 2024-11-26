import React, { useEffect, useState, useRef } from 'react';
import './Sample.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import { useNavigate } from 'react-router-dom';
import { API_VPS, API_BASE_URL } from '../constant/constants';

const Sample = () => {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // Use navigate for redirection
  const token = localStorage.getItem('accessToken');
  const URL = API_BASE_URL;

  // Fetch list of samples from the API
  useEffect(() => {
    fetch(URL + '/api/samples', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`, // Gắn JWT vào header
        'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
      },  
    })
      .then((response) => response.json())
      .then((data) => setSamples(data))
      .catch((error) => console.error('Error fetching samples:', error));
  }, [token, URL]);

  // Fetch details of a sample by ID when a sample is clicked
  const handleSampleClick = (id) => {
    fetch(`${API_VPS}/api/samples/${id}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`, // Gắn JWT vào header
        'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
      },  
    })
      .then((response) => response.json())
      .then((data) => setSelectedSample(data))
      .catch((error) => console.error('Error fetching sample details:', error));
  };

  // Load and draw image on canvas when a sample is selected
  useEffect(() => {
    if (selectedSample) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // img.src = `http://localhost:5000/get-file?path=${selectedSample.path.replaceAll('\\', '/')}`;
      img.src = selectedSample.path
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        selectedSample.labels.forEach((label, index) => {
          const { centerX, centerY, width, height } = label;
          const x_center_px = centerX * canvas.width;
          const y_center_px = centerY * canvas.height;
          const w_px = width * canvas.width * 0.35;
          const h_px = height * canvas.height * 2.3;
          const x_min = x_center_px - w_px / 2;
          const y_min = y_center_px - h_px / 2;

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 1;
          ctx.strokeRect(x_min, y_min, w_px, h_px);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(index + 1, x_min, y_min);
        });
      };
    }
  }, [selectedSample]);

  const handleAddSample = () => {
    navigate('/createSample');
  };

  // Navigate to EditSample page with the selected sample ID
  const handleEditSample = (id) => {
    navigate(`/updateSample/${id}`);
  };

  // Delete sample with confirmation
  const handleDeleteSample = (id) => {
    if (window.confirm("Are you sure you want to delete this sample?")) {
      fetch(`${API_VPS}/api/samples/${id}`, {
        credentials: 'include'  ,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Gắn JWT vào header
          'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
        },
      })
        .then(() => setSamples(samples.filter((sample) => sample.id !== id)))
        .catch((error) => console.error('Error deleting sample:', error));
    }
  };

  return (
    <div className="sample-container">
      {/* Sample Details */}
      {selectedSample ? (
        <div className="sample-details">
          <h2>Name: {selectedSample.name}</h2>
          <p><strong>Code:</strong> {selectedSample.code}</p>
          <img
            // src={`http://localhost:5000/get-file?path=${selectedSample.path.replaceAll('\\', '/')}`}
            src={selectedSample.path}
            alt={selectedSample.name}
            style={{ display: 'none' }}
          />
          <canvas ref={canvasRef} />

          {/* Label Details Table */}
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
                    <td className="description-column-detail" title={label.traffic_sign.description}>{label.traffic_sign.description}</td>
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

      {/* Samples Grid */}
      <div className="samples-grid">
        <button className="btn btn-primary add-sample-button" onClick={handleAddSample}>
          Add Sample
        </button>
        {samples.map((sample) => (
          <div
            key={sample.id}
            className="sample-card"
            onClick={() => handleSampleClick(sample.id)}
          >
            <img
              // src={`http://localhost:5000/get-file?path=${sample.path.replaceAll('\\', '/')}`}
              src={sample.path}
              alt={sample.name}
            />
            <div className="sample-actions">
              <FontAwesomeIcon
                icon={faEdit}
                color="dodgerblue"
                className="sample-action-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSample(sample.id);
                }}
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="red"
                className="sample-action-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSample(sample.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sample;
