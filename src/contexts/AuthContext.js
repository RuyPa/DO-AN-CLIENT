import React, { createContext, useState, useEffect } from 'react';

// Tạo AuthContext
export const AuthContext = createContext();

// Tạo AuthProvider để cung cấp trạng thái xác thực
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Đồng bộ trạng thái xác thực từ localStorage
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = localStorage.getItem('name');
        setIsAuthenticated(loggedIn);
        if (loggedIn) setUser({ name: userData });
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('name', userData.name);
        localStorage.setItem('role', userData.role);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
