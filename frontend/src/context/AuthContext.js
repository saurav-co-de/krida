import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    setUser(response.data.user);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authService.login(credentials);
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.error || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await authService.register(userData);
            const { token, user: newUserData } = response.data;
            localStorage.setItem('token', token);
            setUser(newUserData);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.error || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
