import React, { useState, useEffect } from 'react';
import './Model.css';

const Model = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

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
  };

  // Handle retrain action
  const handleRetrain = (modelId) => {
    console.log(`Retrain model with ID: ${modelId}`);
    // Add retrain logic here
  };

  // Handle delete action
  const handleDelete = (modelId) => {
    console.log(`Delete model with ID: ${modelId}`);
    // Add delete logic here
  };

  return (
    <div className="container">
      {/* Model List Section */}
      <div className="model-list section">
        <h2>Model List</h2>
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
                    onClick={() => handleModelClick(model)}
                    className={model.status === "1" ? 'active-model' : ''}
                  >
                    <td>{model.name}</td>
                    <td>{new Date(model.date).toLocaleDateString()}</td>
                    <td>{model.f1}</td>
                    <td>{model.acc}</td>
                    <td>{model.pre}</td>
                    <td>{model.recall}</td>
                    <td>
                      <input type="checkbox" checked={model.status === "1"} readOnly />
                    </td>
                    <td>
                      <button
                        className="btn-action retrain"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetrain(model.id);
                        }}
                      >
                        Retrain
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(model.id);
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

      {/* Sample List Section */}
      {selectedModel && (
        <div className="sample-list section">
          <h2>Sample List {selectedModel ? `for Model: ${selectedModel.name}` : ''}</h2>
          <div className="scrollable-sample-table">
            <table className="sample-table">
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
                    <tr key={modelSample.id}>
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
                    <td colSpan="3" className="no-content">No samples available</td>
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
