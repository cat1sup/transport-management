import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import './ProfileSettings.css';

export default function ProfileSettings() {
    const [user, setUser] = useState({ username: '', email: '' });
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');
    console.log('Retrieved Token:', token);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            console.log('Token from localStorage:', token); // Debug: Check what's actually in localStorage
    
            if (token) {
                try {
                    console.log('Attempting to fetch user data with token:', token); // Debug: See the token being used in the request
                    const response = await axios.get('/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setError('Failed to fetch user details.');
                }
            } else {
                setError('No token found, please login again.');
            }
        };
        fetchUserData();
    }, []);
    

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error messages when a new submission is made
        const token = localStorage.getItem('token');  // Retrieve the token from local storage
        if (!token) {
            setError('No token found, please login again.');
            return;
        }
        if (!newPassword) {
            setError('Please enter a new password.');
            return;
        }
        try {
            const response = await axios.put('/api/users/update-password', { newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data.message);
            setSuccess('Password updated successfully.');
            setNewPassword('');
        } catch (error) {
            console.error('Failed to update password:', error);
            setError('Failed to update password.');
        }
    };
    

    return (
        <Container className="profile-settings-container">
            <h2>Profile Settings</h2>
            {error && <Alert variant="danger" className="alert-message error-message">{error}</Alert>}
            {success && <Alert variant="success" className="alert-message success-message">{success}</Alert>}
            <div className="profile-details">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <Form className="profile-form" onSubmit={handlePasswordChange}>
                <Form.Group>
                    <Form.Label htmlFor="newPassword">New Password:</Form.Label>
                    <Form.Control
                        type="password"
                        id="newPassword"
                        className="profile-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" className="profile-button">Change Password</Button>
            </Form>
        </Container>  
    );    
}
