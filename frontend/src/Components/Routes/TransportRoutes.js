import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from './Map'; 
import { Row, Col, Card } from 'react-bootstrap';
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
            <Row className="mb-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Transport Routes Planner</Card.Title>
                  <Card.Text>
                  Use the map to view, navigate and plan ahead your routes with how many intermediary stops you need:
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
            <Map />
        </div>
    );
};

export default MapPage;
