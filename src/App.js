// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import Home from './pages/Home';
// import Profile from './pages/Profile';
// import Library from './pages/Library';  // Import Library component
// import Sample from './pages/Sample';
// import CreateSample from './pages/CreateSample';
// import Model from './pages/Model';
// import CreateModel from './pages/CreateModel';
// import UpdateSample from './pages/UpdateSample';


// function App() {
//   return (
//     <Router>
//       <div className="app-container" style={{ display: 'flex' }}>
//         {/* Sidebar bên trái */}
//         <Sidebar />

//         {/* Phần hiển thị chức năng bên phải */}
//         <div className="content" style={{ flex: 1, padding: '20px' }}>
//           <Routes>
//             <Route path="/home" element={<Home />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/library" element={<Library />} /> {/* Thêm route Library */}
//             <Route path="/sample" element={<Sample />} />
//             <Route path="/createSample" element={<CreateSample />} />
//             <Route path="/model" element={<Model />} />
//             <Route path="/createModel" element={<CreateModel />} />
//             <Route path="/updateSample/:id" element={<UpdateSample/>}/>
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Sample from './pages/Sample';
import CreateSample from './pages/CreateSample';
import Model from './pages/Model';
import CreateModel from './pages/CreateModel';
import UpdateSample from './pages/UpdateSample';
import Login from './components/Login';

// Function to check if the user is authenticated
// (you might want to replace this with actual authentication logic)
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};
const role = localStorage.getItem("role");


function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex' }}>
        {/* Conditionally render the Sidebar only if the user is authenticated */}
        {isAuthenticated() && <Sidebar />}

        <div className="content" style={{ flex: 1, padding: '20px' }}>
          <Routes>
            {/* Route for the login page */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            {isAuthenticated() ? (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/sample" element={<Sample />} />
                <Route path="/createSample" element={<CreateSample />} />
                <Route path="/updateSample/:id" element={<UpdateSample />} />
                <Route path="/library" element={<Library />} />


                {role === "admin" && (
                    <>
                        <Route path="/createModel" element={<CreateModel />} />
                        <Route path="/model" element={<Model />} />

                    </>
                )}
              </>
            ) : (
              // Redirect any protected route to /login if not authenticated
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
