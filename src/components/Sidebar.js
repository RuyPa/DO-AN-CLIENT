
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import './Sidebar.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icon


function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name"); // Placeholder, replace with actual user data

  // State to control the drop-up menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/logout', {
        method: 'GET',
        credentials: 'include', // For cookies in session-based auth
      });
  
      if (response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        navigate('/login');
      } else {
        console.error('Logout failed.');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };
  

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link
            to="/home"
            className={location.pathname === '/home' ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            Profile
          </Link>
        </li>
        {(role === "admin") && (
          <li>
            <Link
              to="/library"
              className={location.pathname === '/library' ? 'active' : ''}
            >
              Library
            </Link>
          </li>
        )}

        <li>
          <Link
            to="/sample"
            className={location.pathname === '/sample' ? 'active' : ''}
          >
            Sample
          </Link>
        </li>

        {(role === "admin") && (
          <li>
            <Link
              to="/model"
              className={location.pathname === '/model' ? 'active' : ''}
            >
              Model
            </Link>
          </li>
        )}

        <li>
          <Link
            to="/createModel"
            className={location.pathname === '/createModel' ? 'active' : ''}
          >
            Train Model
          </Link>
        </li>
      </ul>



      {/* User Info Section at the Bottom */}
      <div className="user-info">
        <img src="https://cdn-icons-png.flaticon.com/512/219/219986.png" alt="User" className="user-avatar" /> {/* Replace with actual user image URL */}
        <span className="user-name">{userName}</span>
        <FontAwesomeIcon 
          icon={faCog} 
          className="settings-icon" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        /> {/* FontAwesome Settings (Cog) icon */}

        {/* Drop-up Menu */}
        {isMenuOpen && (
          <div className="user-menu">
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        )}
      </div>

    </div>
  );
}

export default Sidebar;
