import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Ensures axios is configured to handle cookies

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/users/session', { withCredentials: true });
            if (response.data.isLoggedIn) {
                setIsLoggedIn(true);
                setError(null);
            } else {
                setIsLoggedIn(false);
                setError('Session expired or not found');
            }
        } catch (error) {
            console.error('Session check failed:', error);
            setError('Unable to verify user session.');
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/users/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
            setError(null);
        } catch (error) {
            console.error('Failed to log out:', error);
            setError('Logout failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
