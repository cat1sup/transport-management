import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear any existing errors
        try {
            const response = await axios.post('/api/users/register', {
                email, username, password
            });
            console.log(response.data.message);
            navigate('/registration-success'); // Redirect to a success page
        } catch (error) {
            if (error.response) {
                // Handle errors returned from the server
                setError(error.response.data.message);
            } else {
                // Handle other errors like network issues
                setError("The registration process could not be completed.");
            }
        }
    };

    return (
        <div className="register-body">
            <div className="register-background"></div>
            <div className="register-overlay"></div>
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Register</h2>
                {error && <p className="error-message">{error}</p>}
                <div>
                    <label className="register-label">Email:</label>
                    <input className="register-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label className="register-label">Username:</label>
                    <input className="register-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="register-label">Password:</label>
                    <input className="register-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="register-button">Register</button>
                <Link to="/" className="login-button back-button">Back to Main Page</Link>
            </form>
        </div>
    );
}
