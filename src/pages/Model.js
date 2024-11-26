import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Model.css';
import { API_VPS } from '../constant/constants';

const Model = () => {
  const [models, setModels] = useState([]);
  const [samples, setSamples] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [tempSelectedSamples, setTempSelectedSamples] = useState([]);
  const [showRetrainButton, setShowRetrainButton] = useState(false);
  const URL = API_VPS
  const token = localStorage.getItem('accessToken');

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Waiting for retrain progress...');
  const [showRetrainProgress, setShowRetrainProgress] = useState(false);
  const [loadingModelId, setLoadingModelId] = useState(null); // To track which model is loading

  useEffect(() => {
    fetch(URL + '/api/models', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      })
      .then((response) => response.json())
      .then((data) => setModels(data))
      .catch((error) => console.error('Error fetching models:', error));
  }, [URL, token]);

  useEffect(() => {
    fetch(URL + '/api/samples', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      })
      .then((response) => response.json())
      .then((data) => setSamples(data))
      .catch((error) => console.error('Error fetching samples:', error));
  }, [URL, token]);

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000', {
      credentials: 'include',
      transports: ['websocket', 'polling'],
    });

    socket.on('progress', (data) => {
      setMessage(data.message);
      setProgress(data.progress);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleModelClick = (model) => {
    setSelectedModel(model);
    const modelSampleIds = model.model_samples.map((sample) => sample.sample.id);
    setTempSelectedSamples(modelSampleIds);
    setShowRetrainButton(false);
    setShowRetrainProgress(false);
  };

  const toggleActiveStatus = async (modelId) => {
    const confirmSetActive = window.confirm("Are you sure you want to set this model as active?");
    if (!confirmSetActive) return;

    setLoadingModelId(modelId); // Show loading spinner for model being processed

    try {
      const response = await fetch(`${URL}/api/models/${modelId}/set-active`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const updatedModels = await fetch(`${URL}/api/models`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          })
          .then((res) => res.json());
        setModels(updatedModels);
      } else {
        console.error("Failed to update model status.");
      }
    } catch (error) {
      console.error("Error updating model status:", error);
    } finally {
      setLoadingModelId(null); // Hide loading after completion
    }
  };

  const toggleSampleSelection = (sampleId) => {
    setTempSelectedSamples((prevTempSelectedSamples) =>
      prevTempSelectedSamples.includes(sampleId)
        ? prevTempSelectedSamples.filter((id) => id !== sampleId)
        : [...prevTempSelectedSamples, sampleId]
    );
    setShowRetrainButton(true);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allSampleIds = samples.map((sample) => sample.id);
      setTempSelectedSamples(allSampleIds);
    } else {
      setTempSelectedSamples([]);
    }
    setShowRetrainButton(true);
  };

  const handleRetrain = () => {
    const retrainData = {
      samples: tempSelectedSamples,
    };

    fetch('http://127.0.0.1:5000/api/retrain-model/14', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(retrainData),
    })
      .then((response) => response.json())
      .then((data) => {
        setProgress(0);
        setMessage('Retraining model...');
        setShowRetrainProgress(true);
      })
      .catch((error) => console.error('Error retraining model:', error));
  };

  const handleDeleteModel = async (modelId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this model?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${URL}/api/models/${modelId}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        alert("Model deleted successfully!");
        setModels((prevModels) => prevModels.filter((model) => model.id !== modelId));
      } else {
        alert("Failed to delete the model.");
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      alert("An error occurred while deleting the model.");
    }
  };

  const downloadActiveModel = () => {
    const activeModel = models.find((model) => model.status === '1');
    if (activeModel) {
      fetch(`${URL}/api/models/${activeModel.id}/download`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },  
      })
      .then(response => {
        if (response.ok) return response.blob();
        throw new Error('Network response was not ok.');
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = activeModel.name || 'download'; // Use the model's name or provide a default
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Download has started.');
      })
      .catch(error => console.error('Download failed:', error));
    } else {
      alert('No active model found for download.');
    }
  };
  

  return (
    <div className="model-container">
      <div className="model-list section">
        <div className="header">
        <div className="model-list-header">
        <h2>Model List</h2>
          <button className="btn-download" onClick={downloadActiveModel}>
            Download Active Model
          </button>
        </div>

        </div>
        <div className="scrollable-model-table">
          <table className="model-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Creation Date</th>
                <th>F1 Score</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {models.length > 0 ? (
                models.map((model) => (
                  <tr
                    key={model.id}
                    className={`${model.status === '1' ? 'active-model' : ''} ${selectedModel && selectedModel.id === model.id ? 'selected-model' : ''}`}
                    onClick={() => handleModelClick(model)}
                  >
                    <td>{model.name}</td>
                    <td>{new Date(model.date).toLocaleDateString()}</td>
                    <td>{model.f1}</td>
                    <td>{model.acc}</td>
                    <td>{model.pre}</td>
                    <td>{model.recall}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={model.status === '1'}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent click event to only toggle status
                          toggleActiveStatus(model.id);
                        }}
                      />
                      {loadingModelId === model.id && (
                        <span className="loading-spinner"></span> // Show spinner while updating status
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-action delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModel(model.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-content">No models available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedModel && (
        <div className="sample-list section">
          <div className="sample-list-header">
            <h2>Sample List for Model: {selectedModel.name}</h2>
            {showRetrainButton && (
              <button className="btn-retrain" onClick={handleRetrain}>
                Retrain
              </button>
            )}
          </div>
          <div className="scrollable-sample-table">
            <table className="sample-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={samples.length > 0 && tempSelectedSamples.length === samples.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Sample Code</th>
                  <th>Sample Name</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {samples.length > 0 ? (
                  samples.map((sample) => (
                    <tr
                      key={sample.id}
                      className={tempSelectedSamples.includes(sample.id) ? 'selected-sample' : ''}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={tempSelectedSamples.includes(sample.id)}
                          onChange={() => toggleSampleSelection(sample.id)}
                        />
                      </td>
                      <td>{sample.code}</td>
                      <td>{sample.name}</td>
                      <td>
                        <img
                          // src={`http://localhost:5000/get-file?path=${sample.path.replaceAll('\\', '/')}`}
                          src={sample.path}
                          alt={sample.name}
                          style={{ width: '100px' }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-content">No samples available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showRetrainProgress && (
            <>
              <h4>Retrain Progress</h4>
              <div className="progress-container">
                <div className="progress-message">{message}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Model;
