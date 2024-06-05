import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import Map from './Map';

const MapPage = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const mapRef = useRef(null);

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
                    <Button variant="primary" onClick={downloadRoutes}>Download your custom made transport route</Button>
                </Col>
            </Row>
            <Map ref={mapRef} />
        </div>
    );
};

export default MapPage;
