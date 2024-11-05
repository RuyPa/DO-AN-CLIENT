import React, { useState } from 'react';
import './Login.css';
import { API_BASE_URL, CLIENT_BASE_URL } from '../constant/constants'; // Import the constant


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const URL = API_BASE_URL
    const CLIENT_URL = CLIENT_BASE_URL

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                // If your server expects other headers like Content-Type, set them appropriately
                // 'Content-Type': 'application/x-www-form-urlencoded', // Commented out since we're using FormData which sets its own Content-Type with boundary
                'Accept': 'application/json', // Ensures the server knows what type of response the client can process
            },
            credentials: 'include' // If your server requires cookies to be sent, ensure this is included
        };

        try {
            const response = await fetch(URL + '/login', requestOptions);

            if (response.ok) {
                const data = await response.json();
                if (data.message === 'Login successful!') {
                    localStorage.setItem("isLoggedIn", "true");  // Save login state
                    localStorage.setItem("role", data.role); // Store user role
                    localStorage.setItem("name", data.name); // Store user role

                    window.location.href = CLIENT_URL; // Redirect on successful login
                } else {
                    setMessage(data.message || 'Login failed.');
                }
            } else {
                // Handle HTTP errors
                setMessage('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <div className="background"></div>
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;
