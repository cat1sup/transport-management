import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import Map from './Map';
import './TransportRoutes.css';

const MapPage = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const downloadRoutes = () => {
        if (mapRef.current) {
            const routeDetails = mapRef.current.getRoutes();
            const blob = new Blob([routeDetails], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'CustomRoute.txt';
            link.click();
        } else {
            console.error("Map reference is not available.");
        }
    };

    const handleAddMarker = () => {
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                mapRef.current.addMarker(lat, lng);
                setLatitude('');
                setLongitude('');
            } else {
                console.error("Invalid coordinates");
            }
        } else {
            console.error("Coordinates are required");
        }
    };

    return (
        <div className="map-wrapper">
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Transport Routes Planner</Card.Title>
                            <Card.Text>
                                Use the map to view, navigate and plan ahead your routes with how many intermediary stops you need. You can also download the route details for later use.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <div className="inputsMarker">
                        <Form className="inputsWaypoint">
                            <Form.Group controlId="latitude" className="mr-2">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    placeholder="Enter latitude"
                                    className="input-field"
                                />
                            </Form.Group>
                            <Form.Group controlId="longitude" className="mr-2">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    placeholder="Enter longitude"
                                    className="input-field"
                                />
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={handleAddMarker} className="add-marker-button">Add Marker</Button>
                    </div>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Button variant="primary" onClick={downloadRoutes} className="download-button">Download your custom made transport route</Button>
                </Col>
            </Row>
            <Map ref={mapRef} />
        </div>
    );
};

export default MapPage;
