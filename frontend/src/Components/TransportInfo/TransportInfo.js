import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './TransportInfo.css';

const TransportInfo = () => {
    const [stops, setStops] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentData, setCurrentData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        fetchStops();
        fetchDrivers();
        fetchVehicles();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get('type');
        const id = queryParams.get('id');
        if (type && id) {
            if (type === 'driver') {
                const driver = drivers.find(d => d.id === parseInt(id));
                if (driver) handleShow(type, driver);
            } else if (type === 'vehicle') {
                const vehicle = vehicles.find(v => v.id === parseInt(id));
                if (vehicle) handleShow(type, vehicle);
            }
        }
    }, [location.search, drivers, vehicles]);

    const fetchStops = async () => {
        try {
            const response = await axios.get('/api/stops');
            setStops(response.data);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('/api/vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleShow = (type, data = null) => {
        setModalType(type);
        setCurrentData(data);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentData(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(`Submitting ${modalType}`, currentData);
            if (currentData?.id) {
                // Update existing record
                const response = await axios.put(`/api/${modalType}s/${currentData.id}`, currentData, { withCredentials: true });
                console.log('Update response:', response.data);
            } else {
                // Create new record
                const response = await axios.post(`/api/${modalType}s`, currentData, { withCredentials: true });
                console.log('Create response:', response.data);
            }
            handleClose();
            fetchStops();
            fetchDrivers();
            fetchVehicles();
        } catch (error) {
            console.error(`Error saving ${modalType}:`, error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async (type, id) => {
        try {
            console.log(`Deleting ${type} with ID ${id}`);
            const response = await axios.delete(`/api/${type}s/${id}`, { withCredentials: true });
            console.log('Delete response:', response.data);
            fetchStops();
            fetchDrivers();
            fetchVehicles();
        } catch (error) {
            console.error(`Error deleting ${type}:`, error.response ? error.response.data : error.message);
        }
    };

    const renderTableRows = (data, type) => {
        return data.map((item) => (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.Name}</td>
                {type === 'stop' && (
                    <>
                        <td>{item.Longitude}</td>
                        <td>{item.Latitude}</td>
                        <td>{item.PostalCode}</td>
                        <td>{item.Address}</td>
                        <td>{item.ContactPerson}</td>
                    </>
                )}
                {type === 'driver' && (
                    <>
                        <td>{item.Vehicle}</td>
                        <td>{item.LicenseType}</td>
                        <td>{item.PhoneNumber}</td>
                        <td>{item.Email}</td>
                        <td>{item.Address}</td>
                        <td>{item.HireDate}</td>
                        <td>{item.DateOfBirth}</td>
                        <td>{item.EmergencyContact}</td>
                        <td>{item.Status}</td>
                    </>
                )}
                {type === 'vehicle' && (
                    <>
                        <td>{item.LicensePlate}</td>
                        <td>{item.Model}</td>
                        <td>{item.Year}</td>
                        <td>{item.Capacity}</td>
                        <td>{item.Status}</td>
                        <td>{item.LastServiceDate}</td>
                        <td>{item.Mileage}</td>
                        <td>{item.InsuranceNumber}</td>
                        <td>{item.InsuranceExpiry}</td>
                    </>
                )}
                <td>
                    <div className="action-buttons">
                        <Button variant="secondary" className="action-button" onClick={() => handleShow(type, item)}>Edit</Button>
                        <Button variant="danger" className="action-button" onClick={() => handleDelete(type, item.id)}>Delete</Button>
                    </div>
                </td>
            </tr>
        ));
    };

    const renderModalContent = () => {
        switch (modalType) {
            case 'stop':
                return (
                    <>
                        <Form.Group controlId="Name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="Name" value={currentData?.Name || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Longitude">
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control type="text" name="Longitude" value={currentData?.Longitude || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Latitude">
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control type="text" name="Latitude" value={currentData?.Latitude || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="PostalCode">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control type="text" name="PostalCode" value={currentData?.PostalCode || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="Address" value={currentData?.Address || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="ContactPerson">
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control type="text" name="ContactPerson" value={currentData?.ContactPerson || ''} onChange={handleChange} required />
                        </Form.Group>
                    </>
                );
            case 'driver':
                return (
                    <>
                        <Form.Group controlId="Name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="Name" value={currentData?.Name || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Vehicle">
                            <Form.Label>Vehicle</Form.Label>
                            <Form.Control type="text" name="Vehicle" value={currentData?.Vehicle || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="LicenseType">
                            <Form.Label>License Type</Form.Label>
                            <Form.Control type="text" name="LicenseType" value={currentData?.LicenseType || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="PhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" name="PhoneNumber" value={currentData?.PhoneNumber || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="Email" value={currentData?.Email || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="Address" value={currentData?.Address || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="HireDate">
                            <Form.Label>Hire Date</Form.Label>
                            <Form.Control type="date" name="HireDate" value={currentData?.HireDate || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="DateOfBirth">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" name="DateOfBirth" value={currentData?.DateOfBirth || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="EmergencyContact">
                            <Form.Label>Emergency Contact</Form.Label>
                            <Form.Control type="text" name="EmergencyContact" value={currentData?.EmergencyContact || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" name="Status" value={currentData?.Status || ''} onChange={handleChange} required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>
                    </>
                );
            case 'vehicle':
                return (
                    <>
                        <Form.Group controlId="Name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="Name" value={currentData?.Name || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="LicensePlate">
                            <Form.Label>License Plate</Form.Label>
                            <Form.Control type="text" name="LicensePlate" value={currentData?.LicensePlate || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Model">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" name="Model" value={currentData?.Model || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Year">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="number" name="Year" value={currentData?.Year || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Capacity">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control type="text" name="Capacity" value={currentData?.Capacity || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" name="Status" value={currentData?.Status || ''} onChange={handleChange} required>
                                <option value="available">Available</option>
                                <option value="in-use">In-Use</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="LastServiceDate">
                            <Form.Label>Last Service Date</Form.Label>
                            <Form.Control type="date" name="LastServiceDate" value={currentData?.LastServiceDate || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="Mileage">
                            <Form.Label>Mileage</Form.Label>
                            <Form.Control type="number" name="Mileage" value={currentData?.Mileage || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="InsuranceNumber">
                            <Form.Label>Insurance Number</Form.Label>
                            <Form.Control type="text" name="InsuranceNumber" value={currentData?.InsuranceNumber || ''} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="InsuranceExpiry">
                            <Form.Label>Insurance Expiry</Form.Label>
                            <Form.Control type="date" name="InsuranceExpiry" value={currentData?.InsuranceExpiry || ''} onChange={handleChange} required />
                        </Form.Group>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="transport-info-page">
            <div className="cards-info-page">
            <div className="table-container">
                <h2>Stops</h2>
                <Button variant="primary" onClick={() => handleShow('stop')}>Add Stop</Button>
                <div className="table-responsive">
                    <Table striped bordered hover className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Longitude</th>
                                <th>Latitude</th>
                                <th>Postal Code</th>
                                <th>Address</th>
                                <th>Contact Person</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows(stops, 'stop')}
                        </tbody>
                    </Table>
                </div>
            </div>

            <div className="table-container">
                <h2>Drivers</h2>
                <Button variant="primary" onClick={() => handleShow('driver')}>Add Driver</Button>
                <div className="table-responsive">
                    <Table striped bordered hover className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Vehicle</th>
                                <th>License Type</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Hire Date</th>
                                <th>Date of Birth</th>
                                <th>Emergency Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows(drivers, 'driver')}
                        </tbody>
                    </Table>
                </div>
            </div>

            <div className="table-container">
                <h2>Vehicles</h2>
                <Button variant="primary" onClick={() => handleShow('vehicle')}>Add Vehicle</Button>
                <div className="table-responsive">
                    <Table striped bordered hover className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>License Plate</th>
                                <th>Model</th>
                                <th>Year</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Last Service Date</th>
                                <th>Mileage</th>
                                <th>Insurance Number</th>
                                <th>Insurance Expiry</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows(vehicles, 'vehicle')}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentData?.id ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {renderModalContent()}
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                            <Button variant="primary" type="submit">Save</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        </div>
    );
};

export default TransportInfo;
