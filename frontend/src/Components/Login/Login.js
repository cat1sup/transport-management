import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', {
                email, password
            });
            console.log("Login successful", data.token);
            // Optional: Store the token in localStorage/sessionStorage
            // redirect to another route/page
        } catch (error) {
            console.error("Login failed", error.response.data.message);
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
