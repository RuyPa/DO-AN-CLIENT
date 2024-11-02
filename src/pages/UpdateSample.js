import React, { useState, useRef, useEffect } from 'react';
import './UpdateSample.css';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateSample = () => {
  const { id } = useParams(); // Get the sample ID from the URL
  console.log(id);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [selectionData, setSelectionData] = useState([]);
  const [code, setCode] = useState('');
  const [path, setPath] = useState('');
  const [trafficSigns, setTrafficSigns] = useState([]);
  const imageRef = useRef(null);
  const selectionBoxRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [deletedIds, setDeletedIds] = useState([]); // Biến chứa các ID bị xóa

  const navigate = useNavigate();

  // Fetch traffic signs from API
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/traffic_signs')
      .then(response => response.json())
      .then(data => setTrafficSigns(data))
      .catch(error => console.error('Error fetching traffic signs:', error));
  }, []);

  // Fetch the existing sample data using the ID from the URL and fill form fields
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:5000/api/samples/${id}`)
        .then(response => response.json())
        .then(data => {
          setCode(data.code);
          setPath(data.path);
          setImagePreviewUrl(`http://localhost:5000/get-file?path=${data.path.replaceAll('\\', '/')}`);
          
          // Map the labels data to match the selectionData format and prefill fields
          const formattedLabels = data.labels.map((label, index) => ({
            centerX: label.centerX.toFixed(18),
            centerY: label.centerY.toFixed(18),
            width: label.height.toFixed(18),
            height: label.width.toFixed(18),
            traffic: label.traffic_sign.name,
            trafficImage: label.traffic_sign.path,
            stt: index + 1,
            id: `selection-${label.id}`
          }));

          setSelectionData(formattedLabels);
          drawLabels(formattedLabels); // Call the function to draw labels on the image
        })
        .catch(error => console.error('Error fetching sample details:', error));
    }
  }, [id]);

  // Function to draw labels on the image
  const drawLabels = (labels) => {
    const rect = imageRef.current.getBoundingClientRect();
    // Clear any existing labels before drawing
    const existingLabels = document.querySelectorAll('.selected-area');
    existingLabels.forEach(label => label.remove());

    labels.forEach(label => {
      const { centerX, centerY, width, height, stt } = label;

      const selectionDiv = document.createElement('div');
      selectionDiv.classList.add('selected-area');
      selectionDiv.style.left = `${(centerX * rect.width) - (width * rect.width) / 2}px`;
      selectionDiv.style.top = `${(centerY * rect.height) - (height * rect.height) / 2}px`;
      selectionDiv.style.width = `${width * rect.width}px`;
      selectionDiv.style.height = `${height * rect.height}px`;
      selectionDiv.setAttribute('id', label.id);

      const sttSpan = document.createElement('span');
      sttSpan.classList.add('stt-label');
      sttSpan.innerText = stt;

      selectionDiv.appendChild(sttSpan);
      imageRef.current.parentNode.appendChild(selectionDiv);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target.result);
        const fileName = file.name;
        const fixedPath = `C:\\Users\\ruy_pa_\\OneDrive - ptit.edu.vn\\do_an_2024\\YOLO\\vn1\\train\\images\\${fileName}`;
        setPath(fixedPath);
      };
      reader.readAsDataURL(file);
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
    const width = (box.width / rect.width).toFixed(18);
    const height = (box.height / rect.height).toFixed(18);
    const newLabelIndex = selectionData.length + 1;
    const selectionId = `selection-${newLabelIndex}`;

    const selectionDiv = document.createElement('div');
    selectionDiv.classList.add('selected-area');
    selectionDiv.style.left = `${box.left - rect.left}px`;
    selectionDiv.style.top = `${box.top - rect.top}px`;
    selectionDiv.style.width = `${box.width}px`;
    selectionDiv.style.height = `${box.height}px`;
    selectionDiv.setAttribute('id', selectionId);

    const sttSpan = document.createElement('span');
    sttSpan.classList.add('stt-label');
    sttSpan.innerText = newLabelIndex;

    selectionDiv.appendChild(sttSpan);
    imageRef.current.parentNode.appendChild(selectionDiv);

    const newLabel = { centerX, centerY, width, height, traffic: '', stt: newLabelIndex, id: selectionId };
    setSelectionData([...selectionData, newLabel]);

    selectionBoxRef.current.style.display = 'none';
  };

  const handleDelete = (index) => {
    const updatedSelectionData = [...selectionData];
    const labelToDelete = updatedSelectionData[index];
  
    // Nếu label đã có ID (tồn tại trong DB), thêm ID vào mảng deletedIds
    if (labelToDelete.id) {
      setDeletedIds((prevDeletedIds) => [...prevDeletedIds, labelToDelete.id.split('-')[1]]);
    }
    
    const elementToRemove = document.getElementById(labelToDelete.id);
    
    // Remove the visual representation of the label
    if (elementToRemove) {
      elementToRemove.remove();
    }

    // Remove the label from selection data
    updatedSelectionData.splice(index, 1);

    // Update the stt (index) of remaining labels
    updatedSelectionData.forEach((item, idx) => {
      item.stt = idx + 1; // Update the index
      const elementToUpdate = document.getElementById(item.id);
      if (elementToUpdate) {
        const sttLabel = elementToUpdate.querySelector('.stt-label');
        if (sttLabel) {
          sttLabel.innerText = item.stt; // Update the displayed index
        }
      }
    });

    // Update the state and redraw the labels
    setSelectionData(updatedSelectionData);
    
    // Redraw the updated labels on the image
    drawLabels(updatedSelectionData);
  };

  const formatNumber = (num) => `${parseFloat(num).toFixed(2)}...`;

  const handleSubmit = () => {
    const labels = selectionData.map((data) => {
      const trafficSign = trafficSigns.find(sign => sign.name === data.traffic);
  
      // Initialize the label payload object
      const labelPayload = {
        id: data.id ? parseInt(data.id.split('-')[1]) : undefined, // Preserve the ID if it exists
        centerX: parseFloat(data.centerX),
        centerY: parseFloat(data.centerY),
        height: parseFloat(data.width),
        width: parseFloat(data.height),
        traffic_sign_id: trafficSign ? trafficSign.id : null
      };
  
      return labelPayload;
    });

    // Add deleted labels to payload with deleted flag
    const deletedLabels = deletedIds.map(deletedId => ({
      id: parseInt(deletedId),
      isDeleted: true
    }));

    const postData = {
      code,
      name: path.split('\\').pop(),
      path,
      labels: [...labels, ...deletedLabels] // Include both active and deleted labels
    };
  
    // Make the PUT request to the API
    fetch(`http://127.0.0.1:5000/api/samples/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Data updated successfully!');
        window.location.reload(); // Optionally reload to refresh the state of the app
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update data');
      });
  };
  
  const handleTrafficChange = (index, value) => {
    const updatedSelectionData = [...selectionData];
    const selectedTraffic = trafficSigns.find(sign => sign.name === value);
    if (selectedTraffic) {
      updatedSelectionData[index].traffic = value;
      updatedSelectionData[index].trafficImage = selectedTraffic.path;
    }
    setSelectionData(updatedSelectionData);
  };

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={() => navigate('/sample')}>Back</button>
      <div className="input-container">
        <label>Enter Code: </label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {path && (
        <div className="input-container">
          <label>Path: </label>
          <input type="text" value={path} readOnly />
        </div>
      )}
      
      <div id="image-container" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <img
          ref={imageRef}
          src={imagePreviewUrl}
          alt="Upload Preview"
          className="img-fluid"
          draggable="false"
        />
        <div ref={selectionBoxRef} id="selection-box" style={{ display: 'none' }}></div>
      </div>

      <div className="button-container">
        <button className="btn btn-primary submit-button" onClick={handleSubmit}>Submit Data</button>
      </div>


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
                  <select
                    value={data.traffic}
                    onChange={(e) => handleTrafficChange(index, e.target.value)}
                  >
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

    </div>
  );
};

export default UpdateSample;
