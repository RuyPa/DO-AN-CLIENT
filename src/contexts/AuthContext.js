// import React, { createContext, useState, useEffect } from 'react';

// // Tạo AuthContext
// export const AuthContext = createContext();

// // Tạo AuthProvider để cung cấp trạng thái xác thực
// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
//         const userData = localStorage.getItem('name');
//         console.log('isLoggedIn:', loggedIn, 'userData:', userData);  // Kiểm tra giá trị trong localStorage
//         setIsAuthenticated(loggedIn);
//         if (loggedIn) setUser({ name: userData });
//     }, []);

//     const login = (userData) => {
//         setIsAuthenticated(true);
//         setUser(userData);
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('name', userData.name);
//         localStorage.setItem('role', userData.role);
//     };

//     const logout = () => {
//         setIsAuthenticated(false);
//         setUser(null);
//         localStorage.clear();
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
import React, { createContext, useState, useEffect } from 'react';

// Tạo AuthContext
export const AuthContext = createContext();

// Tạo AuthProvider để cung cấp trạng thái xác thực
export const AuthProvider = ({ children }) => {
    // Tạm thời set isAuthenticated là true để không phải kiểm tra đăng nhập
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Đặt là true để không phải kiểm tra login
    const [user, setUser] = useState({ name: 'Duy Admin' });  // Dữ liệu người dùng giả (có thể thay đổi)

    useEffect(() => {
        // Nếu bạn muốn lưu trữ dữ liệu tạm thời, có thể sử dụng localStorage như trước
        // localStorage.setItem('isLoggedIn', 'true');
        // localStorage.setItem('name', 'Duy Admin');
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
