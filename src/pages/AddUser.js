
import React, { useState, useEffect } from 'react';
import './AddUser.css';

const AddUser = ({ apiUrl, isClicked }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  });
  const token = localStorage.getItem('accessToken');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Khi `isClicked` là `false`, reset form
    if (!isClicked) {
      setFormData({
        name: '',
        email: '',
        address: '',
        role: 'user',
        password: '',
        confirmPassword: '',
      });
    }
  }, [isClicked]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      window.alert('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          role: formData.role,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.alert(data.message || 'User added successfully!');
        setFormData({
          name: '',
          email: '',
          address: '',
          role: 'user',
          password: '',
          confirmPassword: '',
        });
      } else {
        const errorData = await response.json();
        let errorMessage = errorData.error || errorData.message || 'Failed to add user.';
        if (typeof errorMessage === 'object') {
          errorMessage = JSON.stringify(errorMessage);
        }
        window.alert(errorMessage);
      }
    } catch (err) {
      window.alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container"
    style={{ display: isClicked ? 'flex' : 'none' }}

    >
      {isClicked && ( // Hiển thị form chỉ khi `isClicked` là true
        <>
          <h2>Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button className="button-login" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddUser;
