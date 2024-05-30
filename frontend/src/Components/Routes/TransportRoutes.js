import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from './Map'; 
import { useAuth } from '../AuthContext'; 

const MapPage = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="map-wrapper">
            <h1 className="map-heading">Transport Routes Planner</h1>
            <p className="map-description">Use the map to view, navigate and plan ahead your routes with how many intermediary stops you need:</p>
            <Map />
        </div>
    );
};

export default MapPage;
