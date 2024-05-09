import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import './ProfileSettings.css';

export default function ProfileSettings() {
    const [user, setUser] = useState({ username: '', email: '' });
    const [currentPassword, setCurrentPassword] = useState(''); // Add state for current password
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/users/me', {
                    withCredentials: true  
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user details.');
            }
        };
        fetchUserData();
    }, []);
    
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        if (!currentPassword || !newPassword) {
            setError('Please enter both current and new password.');
            return;
        }
        try {
            const response = await axios.put('/api/users/update-password', { currentPassword, newPassword }, {
                withCredentials: true 
            });
            console.log(response.data.message);
            setSuccess('Password updated successfully.');
            setCurrentPassword('');
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
                    <Form.Label htmlFor="currentPassword"><strong>Current Password:</strong></Form.Label>
                    <Form.Control
                        type="password"
                        id="currentPassword"
                        className="profile-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="newPassword"><strong>New Password:</strong></Form.Label>
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
