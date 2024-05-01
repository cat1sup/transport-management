import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth from your context
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // For programmatic navigation
    const { login } = useAuth(); // Access the login method from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/login', { email, password });
            const data = response.data;
            console.log("Received data from login:", data);
            if (data.token) {
                console.log("Login successful", data.token);
                localStorage.setItem('token', data.token); 
                console.log('Token stored:', localStorage.getItem('token'));// Store the token in local storage
                login(); // Update the global state to indicate the user is logged in
                navigate('/dashboard'); // Navigate to the dashboard after successful login
                console.log('Token:', data.token);
            } else {
                console.error("Token not received");
            }
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
