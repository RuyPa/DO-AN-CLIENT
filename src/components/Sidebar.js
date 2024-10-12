// // src/components/Sidebar.js
// import { Link } from 'react-router-dom';
// import './Sidebar.css'; // Có thể thêm CSS sau

// function Sidebar() {
//   return (
//     <div className="sidebar">
//       <ul>
//         <li><Link to="/home">Home</Link></li>
//         <li><Link to="/profile">Profile</Link></li>
//         <li><Link to="/library">Library</Link></li> {/* Thêm Library */}
//         <li><Link to="/sample">Sample</Link></li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;
// src/components/Sidebar.js
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation(); // Lấy thông tin về đường dẫn hiện tại

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
        <li>
          <Link
            to="/library"
            className={location.pathname === '/library' ? 'active' : ''}
          >
            Library
          </Link>
        </li>
        <li>
          <Link
            to="/sample"
            className={location.pathname === '/sample' ? 'active' : ''}
          >
            Sample
          </Link>
        </li>
        <li>
          <Link
            to="/model"
            className={location.pathname === '/model' ? 'active' : ''}
          >
            Model
          </Link>
        </li>
        {/* <li>
          <Link
            to="/createSample"
            className={location.pathname === '/createSample' ? 'active' : ''}
          >
            CreateSample
          </Link>
        </li> */}
      </ul>
    </div>
  );
}

export default Sidebar;
