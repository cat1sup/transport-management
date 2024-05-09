import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';  

function Dashboard() {
    const { isLoggedIn } = useAuth();  // Use your AuthContext to check if logged in
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            console.log('Not logged in, redirecting to login.');
            navigate('/login');  
        } else {
            fetchData();
        }
    }, [isLoggedIn, navigate]); 

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/dashboard/data', {
                withCredentials: true  
            });
            setData(response.data);  
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setError('Failed to load data.');
        }
    };

    if (!isLoggedIn) {
        return null;  // Do not render anything if not logged in
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {error ? <p>Error: {error}</p> : <p>Welcome to the Dashboard! This is the main area of the application.</p>}
            {data && <div>{/* Render your fetched data here */}</div>}
        </div>
    );
}

export default Dashboard;
