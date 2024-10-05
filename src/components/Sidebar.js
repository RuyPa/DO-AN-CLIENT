// src/components/Sidebar.js
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Có thể thêm CSS sau

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/library">Library</Link></li> {/* Thêm Library */}
        <Link to="/sample">Sample</Link>
      </ul>
    </div>
  );
}

export default Sidebar;
