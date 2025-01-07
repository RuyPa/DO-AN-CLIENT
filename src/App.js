import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider và AuthContext
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
import User from './pages/User';
import AddUser from './pages/AddUser';
import UpdateUser from './pages/UpdateUser';
import RetrainModel from './pages/RetrainModel';
import ModelTable from './pages/ModelTable';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Route dành cho Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Routes chính của ứng dụng */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedApp />
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

const ProtectedApp = () => {
    // Bỏ qua việc kiểm tra isAuthenticated, mặc định cho phép truy cập
    return (
        <div className="app-container" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="content" style={{ flex: 1, padding: '20px' }}>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/sample" element={<Sample />} />
                    <Route path="/createSample" element={<CreateSample />} />
                    <Route path="/updateSample/:id" element={<UpdateSample />} />
                    <Route path="/createModel" element={<CreateModel />} />
                    <Route path="/model" element={<Model />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/update-user" element={<UpdateUser />} />
                    <Route path="/retrain-model" element={<RetrainModel />} />
                    <Route path='/model-static' element={<ModelTable />} />
                </Routes>
            </div>
        </div>
    );
};



export default App;
