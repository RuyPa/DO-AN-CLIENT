import React, { useState } from 'react';
import './CreateSample.css'; // Make sure this CSS is designed for CreateSample and does not conflict with other styles

const CreateSample = () => {
  const [sample, setSample] = useState({
    code: '',
    name: '',
    path: '',
    labels: [],
    file: null
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSample({ ...sample, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSample({ ...sample, path: file.name, file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLabelChange = (index, e) => {
    const updatedLabels = [...sample.labels];
    updatedLabels[index] = { ...updatedLabels[index], [e.target.name]: parseFloat(e.target.value) };
    setSample({ ...sample, labels: updatedLabels });
  };

  const addLabel = () => {
    setSample({ ...sample, labels: [...sample.labels, { centerX: 0, centerY: 0, height: 0, width: 0, traffic_sign_id: 0 }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', sample);
    alert('Check the console for output');
  };

  return (
    <div className="create-sample-container">
      <div className="create-form-container">
        <h3>Add New Sample</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="code" value={sample.code} onChange={handleChange} placeholder="Code" />
          <input type="text" name="name" value={sample.name} onChange={handleChange} placeholder="Name" />
          <input type="file" onChange={handleFileChange} />
          {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" />}
          <div className="label-details-container">
            <table>
              <thead>
                <tr>
                  <th>Center X</th>
                  <th>Center Y</th>
                  <th>Height</th>
                  <th>Width</th>
                  <th>Traffic Sign ID</th>
                </tr>
              </thead>
              <tbody>
                {sample.labels.map((label, index) => (
                  <tr key={index}>
                    <td><input type="text" inputMode="decimal" name="centerX" value={label.centerX} onChange={e => handleLabelChange(index, e)} /></td>
                    <td><input type="text" inputMode="decimal" name="centerY" value={label.centerY} onChange={e => handleLabelChange(index, e)} /></td>
                    <td><input type="text" inputMode="decimal" name="height" value={label.height} onChange={e => handleLabelChange(index, e)} /></td>
                    <td><input type="text" inputMode="decimal" name="width" value={label.width} onChange={e => handleLabelChange(index, e)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addLabel}>Add Label</button>
          <button type="submit">Save New Sample</button>
        </form>
      </div>
    </div>
  );
};

export default CreateSample;
