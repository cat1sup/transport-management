import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './Shipments.css';

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newShipment, setNewShipment] = useState({ name: '', origin: '', destination: '' });

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const response = await axios.get('/api/shipments', { withCredentials: true });
            setShipments(response.data);
        } catch (error) {
            console.error('Failed to fetch shipments:', error);
        }
    };

    const handleAddShipment = async () => {
        try {
            const response = await axios.post('/api/shipments', newShipment, { withCredentials: true });
            setShipments([...shipments, response.data]);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to add shipment:', error);
        }
    };

    return (
        <div className="shipments-container">
            <h1>Shipments</h1>
            <Button onClick={() => setShowModal(true)}>Add Shipment</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Origin</th>
                        <th>Destination</th>
                    </tr>
                </thead>
                <tbody>
                    {shipments.map((shipment, index) => (
                        <tr key={index}>
                            <td>{shipment.name}</td>
                            <td>{shipment.origin}</td>
                            <td>{shipment.destination}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Shipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newShipment.name}
                                onChange={(e) => setNewShipment({ ...newShipment, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Origin</Form.Label>
                            <Form.Control
                                type="text"
                                value={newShipment.origin}
                                onChange={(e) => setNewShipment({ ...newShipment, origin: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Destination</Form.Label>
                            <Form.Control
                                type="text"
                                value={newShipment.destination}
                                onChange={(e) => setNewShipment({ ...newShipment, destination: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddShipment}>
                            Add Shipment
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Shipments;
