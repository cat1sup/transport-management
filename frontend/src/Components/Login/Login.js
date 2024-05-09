import React, { useState } from 'react';
import axios from '../../axiosConfig'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users/login', { email, password });
            login();  // Signal that login has occurred without handling a token
            navigate('/dashboard');  // Navigate after successful login
        } catch (error) {
            console.error("Login failed", error.response ? error.response.data.message : "No response from server");
        }
    };

    return (
        <div className="login-body">
            <div className="login-background"></div>
            <div className="login-overlay"></div>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>
                <div className="login-field">
                    <label className="login-label">Email:</label>
                    <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="login-field">
                    <label className="login-label">Password:</label>
                    <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="login-button" type="submit">Login</button>
                <Link to="/" className="login-button back-button">Back to Main Page</Link>
            </form>
        </div>
    );
}
