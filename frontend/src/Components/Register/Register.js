import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import './Register.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/register', {
                email, username, password
            });
            console.log(data.message);
            // Redirect to login page or dashboard here
        } catch (error) {
            console.error("Registration failed", error.response.data.message);
        }
    };

    return (
        <div className="register-body"> 
            <div className="register-background"></div>  
            <div className="register-overlay"></div> 
            <form className="register-form" onSubmit={handleSubmit}> 
                <h2 className="register-title">Register</h2> 
                <div className="form-group">
                    <label className="register-label">Email:</label>
                    <input className="register-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="register-label">Username:</label>
                    <input className="register-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="register-label">Password:</label>
                    <input className="register-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="register-button" type="submit">Register</button> 
                <Link to="/" className="login-button back-button">Back to Main Page</Link>
            </form>
        </div>
    );
}
