import React from 'react';
import Map from './Map'; // Ensure the correct path

const MapPage = () => {
    return (
        <div className="map-wrapper">
            <h1 className="map-heading">Transport Routes Planner</h1>
            <p className="map-description">Use the map to view and navigate your routes with how many intermediary stops you need.</p>
            <Map />
        </div>
    );
};

export default MapPage;
