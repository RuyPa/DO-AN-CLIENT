import React, { useState, useEffect } from 'react';
import './Model.css';

const Model = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);

  // Fetch models from the API
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/models') // Call API to fetch model list
      .then((response) => response.json())
      .then((data) => setModels(data))
      .catch((error) => console.error('Error fetching models:', error));
  }, []);

  // Handle when a model is clicked
  const handleModelClick = (model) => {
    setSelectedModel(model);
    setSelectedSample(null); // Reset sample when selecting a new model
  };

  // Handle when a sample is clicked
  const handleSampleClick = (sample) => {
    setSelectedSample(sample);
  };

  return (
    <div className="container">
      {/* Model List Section */}
      <div className="model-list section">
        <h2>Model List</h2>
        <div className="scrollable-table">
          <table className="table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Creation Date</th>
                <th>F1 Score</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
              </tr>
            </thead>
            <tbody>
              {models.length > 0 ? (
                models.map((model) => (
                  <tr key={model.id} onClick={() => handleModelClick(model)}>
                    <td>{model.name}</td>
                    <td>{new Date(model.date).toLocaleDateString()}</td>
                    <td>{model.f1}</td>
                    <td>{model.acc}</td>
                    <td>{model.pre}</td>
                    <td>{model.recall}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No models available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chỉ hiển thị Sample List khi đã chọn Model */}
      {selectedModel && (
        <div className="sample-list section">
          <h2>Sample List {selectedModel ? `for Model: ${selectedModel.name}` : ''}</h2>
          <div className="scrollable-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Sample Code</th>
                  <th>Sample Name</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {selectedModel.model_samples.length > 0 ? (
                  selectedModel.model_samples.map((modelSample) => (
                    <tr
                      key={modelSample.id}
                      onClick={() => handleSampleClick(modelSample.sample)}
                    >
                      <td>{modelSample.sample.code}</td>
                      <td>{modelSample.sample.name}</td>
                      <td>
                        <img
                          src={`http://localhost:5000/get-file?path=${modelSample.sample.path.replaceAll('\\', '/')}`}
                          alt={modelSample.sample.name}
                          style={{ width: '100px' }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No samples available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chỉ hiển thị Label List khi đã chọn Sample */}
      {selectedSample && (
        <div className="label-list section">
          <h2>Label Information {selectedSample ? `for Sample: ${selectedSample.name}` : ''}</h2>
          <div className="scrollable-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Traffic Sign Name</th>
                  <th>Description</th>
                  <th>Center X</th>
                  <th>Center Y</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Traffic Sign Image</th>
                </tr>
              </thead>
              <tbody>
                {selectedSample.labels.length > 0 ? (
                  selectedSample.labels.map((label) => (
                    <tr key={label.id}>
                      <td>{label.traffic_sign.name}</td>
                      <td>{label.traffic_sign.description}</td>
                      <td>{label.centerX.toFixed(2)}</td>
                      <td>{label.centerY.toFixed(2)}</td>
                      <td>{label.width.toFixed(2)}</td>
                      <td>{label.height.toFixed(2)}</td>
                      <td>
                        <img
                          src={label.traffic_sign.path}
                          alt={label.traffic_sign.name}
                          style={{ width: '50px' }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No labels available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Model;
