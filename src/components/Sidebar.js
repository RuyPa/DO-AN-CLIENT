
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import './Sidebar.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icon
import { API_VPS } from '../constant/constants';
import {  faHome, faUser, faTrafficLight, faFlask, faCogs, faUsers } from '@fortawesome/free-solid-svg-icons';
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name"); // Placeholder, replace with actual user data

  // State to control the drop-up menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch(API_VPS + '/logout', {
  //       method: 'GET',
  //       credentials: 'include', // For cookies in session-based auth
  //     });
  
  //     if (response.ok) {
  //       localStorage.removeItem("isLoggedIn");
  //       localStorage.removeItem("role");
  //       localStorage.removeItem("name");
  //       navigate('/login');
  //     } else {
  //       console.error('Logout failed.');
  //     }
  //   } catch (error) {
  //     console.error('An error occurred during logout:', error);
  //   }
  // };

  const handleLogout = async () => {
      try {
          const response = await fetch(`${API_VPS}/logout`, {
              method: 'POST', // Sử dụng POST thay vì GET vì logout thường thay đổi trạng thái (thực hiện hành động).
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'include', // Đảm bảo gửi cookie nếu có.
          });

          if (response.ok) {
              // Xóa tất cả thông tin trong localStorage
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('role');
              localStorage.removeItem('name');

              // Điều hướng đến trang login
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
            <FontAwesomeIcon
        icon={faHome}
        color={location.pathname === '/home' ? '#ffffff' : 'black'}
        className="icon-sidebar"
      />
      Home
    </Link>
  </li>
  <li>
    <Link
      to="/profile"
      className={location.pathname === '/profile' ? 'active' : ''}
    >
      <FontAwesomeIcon icon={faUser} color={location.pathname === '/profile' ? '#ffffff' : 'black'} className="icon-sidebar" />
      Profile
    </Link>
  </li>
  <li>
    <Link
      to="/library"
      className={location.pathname === '/library' ? 'active' : ''}
    >
      <FontAwesomeIcon icon={faTrafficLight} color={location.pathname === '/library' ? '#ffffff' : 'black'} className="icon-sidebar" />
      Library
    </Link>
  </li>

  <li>
    <Link
      to="/sample"
      className={location.pathname === '/sample' ? 'active' : ''}
    >
      <FontAwesomeIcon icon={faFlask} color={location.pathname === '/sample' ? '#ffffff' : 'black'} className="icon-sidebar" />
      Sample
    </Link>
  </li>

  {(role === "admin") && (
    <li>
      <Link
        to="/model"
        className={location.pathname === '/model' ? 'active' : ''}
      >
        <FontAwesomeIcon icon={faCogs} color={location.pathname === '/model' ? '#ffffff' : 'black'} className="icon-sidebar" />
        Model
      </Link>
    </li>
  )}

  {(role === "admin") && (
    <li>
      <Link
        to="/user"
        className={location.pathname === '/user' ? 'active' : ''}
      >
        <FontAwesomeIcon icon={faUsers} color={location.pathname === '/user' ? '#ffffff' : 'black'} className="icon-sidebar" />
        User Manage
      </Link>
    </li>
  )}
    {(role === "admin") && (
    <li>
      <Link
        to="/model-static"
        className={location.pathname === '/model-static' ? 'active' : ''}
      >
        <FontAwesomeIcon icon={faUsers} color={location.pathname === '/model-static' ? '#ffffff' : 'black'} className="icon-sidebar" />
        Model Static
      </Link>
    </li>
  )}

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
