// src/components/ModelList.js
import React from 'react';

const ModelList = ({
  models,
  handleModelClick,
  toggleActiveStatus,
  loadingModelId,
  handleDeleteModel,
  downloadActiveModel
}) => {
  return (
    <div className="model-list">
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
                  className={`${model.status === '1' ? 'active-model' : ''} ${loadingModelId === model.id ? 'loading' : ''}`}
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
                        e.stopPropagation();
                        toggleActiveStatus(model.id);
                      }}
                    />
                    {loadingModelId === model.id && (
                      <span className="loading-spinner"></span>
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
  );
};

export default ModelList;
