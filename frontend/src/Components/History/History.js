import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Form, Table, Button } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [driverHistory, setDriverHistory] = useState([]);
    const [vehicleHistory, setVehicleHistory] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchDrivers();
            fetchVehicles();
        }
    }, [isLoggedIn, navigate]);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('/api/drivers', { withCredentials: true });
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('/api/vehicles', { withCredentials: true });
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchDriverHistory = async () => {
        try {
            const response = await axios.get(`/api/shipments/driver/${selectedDriver}/history`, {
                params: { startDate, endDate },
                withCredentials: true
            });
            setDriverHistory(response.data);
        } catch (error) {
            console.error('Error fetching driver history:', error);
        }
    };

    const fetchVehicleHistory = async () => {
        try {
            const response = await axios.get(`/api/shipments/vehicle/${selectedVehicle}/history`, {
                params: { startDate, endDate },
                withCredentials: true
            });
            setVehicleHistory(response.data);
        } catch (error) {
            console.error('Error fetching vehicle history:', error);
        }
    };

    const handleDriverChange = (e) => setSelectedDriver(e.target.value);
    const handleVehicleChange = (e) => setSelectedVehicle(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    const handleSearch = () => {
        if (selectedDriver) fetchDriverHistory();
        if (selectedVehicle) fetchVehicleHistory();
    };

    return (
        <div className="history-page">
            <h1 className="title">Shipment History</h1>
            <div className="filters">
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="selectDriver">
                                <Form.Label>Select Driver</Form.Label>
                                <Form.Control as="select" value={selectedDriver} onChange={handleDriverChange}>
                                    <option value="">Select a driver</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.Name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="selectVehicle">
                                <Form.Label>Select Vehicle</Form.Label>
                                <Form.Control as="select" value={selectedVehicle} onChange={handleVehicleChange}>
                                    <option value="">Select a vehicle</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.Name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="startDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" value={startDate} onChange={handleStartDateChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="endDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" value={endDate} onChange={handleEndDateChange} />
                            </Form.Group>
                        </Col>
                        <Col className="d-flex align-items-end">
                            <Button variant="primary" onClick={handleSearch}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Row>
                <Col md={6}>
                    <h2>Driver History</h2>
                    <Table striped bordered hover className="history-table">
                        <thead>
                            <tr>
                                <th>Shipment Number</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driverHistory.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td>{shipment.ShipmentNumber}</td>
                                    <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(shipment.updatedAt).toLocaleDateString()}</td>
                                    <td>{shipment.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col md={6}>
                    <h2>Vehicle History</h2>
                    <Table striped bordered hover className="history-table">
                        <thead>
                            <tr>
                                <th>Shipment Number</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicleHistory.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td>{shipment.ShipmentNumber}</td>
                                    <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(shipment.updatedAt).toLocaleDateString()}</td>
                                    <td>{shipment.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};

export default History;
