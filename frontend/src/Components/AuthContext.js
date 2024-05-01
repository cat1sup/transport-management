import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Initialize login state based on the token's presence
        return !!localStorage.getItem('token');
    });

    const login = (token) => {
        localStorage.setItem('token', token);  // Store the token in local storage
        setIsLoggedIn(true);                   // Update the isLoggedIn state to true
    };

    const logout = () => {
        localStorage.removeItem('token');  // Remove the token from storage
        setIsLoggedIn(false);              // Update the isLoggedIn state to false
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
