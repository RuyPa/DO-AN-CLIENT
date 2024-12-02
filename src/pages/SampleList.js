// src/components/SampleList.js
import React from 'react';

const SampleList = ({
  samples,
  tempSelectedSamples,
  toggleSelectAll,
  toggleSampleSelection,
  showRetrainButton,
  handleRetrain
}) => {
  return (
    <div className="sample-list section">
      <div className="sample-list-header">
        <h2>Sample List</h2>
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
    </div>
  );
};

export default SampleList;
