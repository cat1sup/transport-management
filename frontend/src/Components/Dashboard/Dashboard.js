import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';  

const Dashboard = () => {
    const { isLoggedIn } = useAuth();  
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);


    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the Dashboard!</p>
        </div>
    );
}

export default Dashboard;
