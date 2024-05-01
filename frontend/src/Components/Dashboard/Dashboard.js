import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';  // Ensure the path is correct

function Dashboard() {
    const { isLoggedIn } = useAuth();  // Use your AuthContext to check if logged in
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');  // Redirect to login if not logged in
        } else {
            fetchData();
        }
    }, [isLoggedIn, navigate]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('/api/dashboard/data', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);  // Assuming the API returns data to be set
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setError('Failed to load data.');
            }
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            {error ? <p>Error: {error}</p> : <p>Welcome to the Dashboard! This is the main area of the application.</p>}
            {data && <div>{/* Render your fetched data here */}</div>}
        </div>
    );
}

export default Dashboard;
