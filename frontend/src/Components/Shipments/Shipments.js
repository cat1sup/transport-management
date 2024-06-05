import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import TransportMap from './TransportMap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Shipments.css';

const Shipments = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [shipments, setShipments] = useState([]);
    const [transportData, setTransportData] = useState({
        stops: [],
        drivers: [],
        vehicles: []
    });
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentShipmentId, setCurrentShipmentId] = useState(null);
    const [currentShipment, setCurrentShipment] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [filters, setFilters] = useState({
        shipmentNumber: '',
        cargoType: '',
        startingLocation: '',
        stoppingLocation: '',
        designatedDriver: '',
        designatedVehicle: ''
    });
    const mapRef = useRef(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchShipments();
            fetchTransportInfo();
        }
    }, [isLoggedIn, navigate]);

    const [newShipment, setNewShipment] = useState({
        ShipmentNumber: '',
        CargoType: 'perishable',
        CargoWeight: '',
        NumberOfPallets: '',
        DesignatedDriverId: '',
        DesignatedVehicleId: '',
        StartingLocationId: '',
        StoppingLocationId: '',
        Status: 'Planned',
        IntermediaryStops: []
    });

    const fetchShipments = async () => {
        try {
            const response = await axios.get('/api/shipments', { withCredentials: true });
            setShipments(response.data);
        } catch (error) {
            console.error('Error fetching shipments:', error.response ? error.response.data : error.message);
        }
    };

    const fetchTransportInfo = async () => {
        try {
            const stopsResponse = await axios.get('/api/stops');
            const driversResponse = await axios.get('/api/drivers');
            const vehiclesResponse = await axios.get('/api/vehicles');

            setTransportData({
                stops: stopsResponse.data,
                drivers: driversResponse.data,
                vehicles: vehiclesResponse.data,
            });
        } catch (error) {
            console.error('Error fetching transport info:', error);
        }
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setIsEditMode(false);
        setCurrentShipmentId(null);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewShipment((prevState) => ({
            ...prevState,
            [name]: value !== '' ? value : null,
        }));
    };

    const handleAddStop = () => {
        setNewShipment((prevState) => ({
            ...prevState,
            IntermediaryStops: [...prevState.IntermediaryStops, { StopId: '' }],
        }));
    };

    const handleStopChange = (e, index) => {
        const { name, value } = e.target;
        const newStops = [...newShipment.IntermediaryStops];
        newStops[index][name] = value !== '' ? value : null;
        setNewShipment((prevState) => ({
            ...prevState,
            IntermediaryStops: newStops,
        }));
    };

    const handleRemoveStop = (index) => {
        const newStops = [...newShipment.IntermediaryStops];
        newStops.splice(index, 1);
        setNewShipment((prevState) => ({
            ...prevState,
            IntermediaryStops: newStops,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', newShipment);
        
        // Helper function to convert empty strings to null
        const convertEmptyToNull = (value) => (value === '' ? null : value);
    
        const shipmentData = {
            ...newShipment,
            DesignatedDriverId: convertEmptyToNull(newShipment.DesignatedDriverId),
            DesignatedVehicleId: convertEmptyToNull(newShipment.DesignatedVehicleId),
            StartingLocationId: convertEmptyToNull(newShipment.StartingLocationId),
            StoppingLocationId: convertEmptyToNull(newShipment.StoppingLocationId),
        };

        // Filter out intermediary stops with empty StopId
        const filteredStops = newShipment.IntermediaryStops.filter(stop => stop.StopId !== '');

        try {
            if (isEditMode) {
                await axios.put(`/api/shipments/${currentShipmentId}`, { shipmentData, stops: filteredStops }, { withCredentials: true });
            } else {
                await axios.post('/api/shipments', { shipmentData, stops: filteredStops }, { withCredentials: true });
            }
            fetchShipments();
            handleClose();
        } catch (error) {
            console.error('Error creating or updating shipment:', error.response ? error.response.data : error.message);
        }
    };

    const handleEdit = (shipment) => {
        setNewShipment({
            ShipmentNumber: shipment.ShipmentNumber,
            CargoType: shipment.CargoType,
            CargoWeight: shipment.CargoWeight,
            NumberOfPallets: shipment.NumberOfPallets,
            DesignatedDriverId: shipment.DesignatedDriverId,
            DesignatedVehicleId: shipment.DesignatedVehicleId,
            StartingLocationId: shipment.StartingLocationId,
            StoppingLocationId: shipment.StoppingLocationId,
            Status: shipment.Status,
            IntermediaryStops: shipment.IntermediaryStops.map((stop) => ({
                StopId: stop.StopId
            })) || [],
        });
        setCurrentShipmentId(shipment.id);
        setIsEditMode(true);
        handleShow();
    };

    const handleDelete = async (shipmentId) => {
        try {
            await axios.delete(`/api/shipments/${shipmentId}`, { withCredentials: true });
            fetchShipments();
        } catch (error) {
            console.error('Error deleting shipment:', error);
        }
    };

    const handleView = (shipment) => {
        setCurrentShipment(shipment);
        setShowViewModal(true);
    };

    const resetForm = () => {
        setNewShipment({
            ShipmentNumber: '',
            CargoType: 'perishable',
            CargoWeight: '',
            NumberOfPallets: '',
            DesignatedDriverId: '',
            DesignatedVehicleId: '',
            StartingLocationId: '',
            StoppingLocationId: '',
            Status: 'Planned',
            IntermediaryStops: [],
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const applyFilters = useCallback(() => {
        let filtered = shipments;

        if (filters.shipmentNumber) {
            filtered = filtered.filter((shipment) =>
                shipment.ShipmentNumber.toLowerCase().includes(filters.shipmentNumber.toLowerCase())
            );
        }
        if (filters.cargoType) {
            filtered = filtered.filter((shipment) =>
                shipment.CargoType.toLowerCase().includes(filters.cargoType.toLowerCase())
            );
        }
        if (filters.startingLocation) {
            filtered = filtered.filter((shipment) =>
                shipment.StartingLocation?.Name.toLowerCase().includes(filters.startingLocation.toLowerCase())
            );
        }
        if (filters.stoppingLocation) {
            filtered = filtered.filter((shipment) =>
                shipment.StoppingLocation?.Name.toLowerCase().includes(filters.stoppingLocation.toLowerCase())
            );
        }
        if (filters.designatedDriver) {
            filtered = filtered.filter((shipment) =>
                shipment.DesignatedDriver?.Name.toLowerCase().includes(filters.designatedDriver.toLowerCase())
            );
        }
        if (filters.designatedVehicle) {
            filtered = filtered.filter((shipment) =>
                shipment.DesignatedVehicle?.Name.toLowerCase().includes(filters.designatedVehicle.toLowerCase())
            );
        }

        return filtered;
    }, [filters, shipments]);

    useEffect(() => {
        applyFilters();
    }, [filters, applyFilters]);

    const filteredShipments = applyFilters();

    const downloadRoutes = () => {
        console.log('Download routes clicked');
        if (!routeInfo || routeInfo.length === 0) {
            console.log('No route info available');
            return;
        }
    
        const doc = new jsPDF();
        doc.text('Shipment Routes', 10, 10);
    
        const routeData = routeInfo.map((instruction) => [
            `Step ${instruction.step}`,
            instruction.text,
        ]);
    
        console.log('Route data:', routeData);
    
        doc.autoTable({
            head: [['Step', 'Instruction']],
            body: routeData,
        });
    
        doc.save(`${currentShipment.ShipmentNumber}_routes.pdf`);
    };
    

    return (
        <div className="shipments-page">
            <div className="shipments-container">
                <h1 className="title">Shipments</h1>
                <div className="filters">
                    <h5 className="filters-text">Filter By:</h5>
                    <Form.Group controlId="filterShipmentNumber" className="filter-group">
                        <Form.Label className="filter-label">Shipment Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="shipmentNumber"
                            value={filters.shipmentNumber}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterCargoType" className="filter-group">
                        <Form.Label className="filter-label">Cargo Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="cargoType"
                            value={filters.cargoType}
                            onChange={handleFilterChange}
                            className="filter-input"
                        >
                            <option value="">All</option>
                            <option value="perishable">Perishable</option>
                            <option value="containerized">Containerized</option>
                            <option value="dry bulk">Dry Bulk</option>
                            <option value="liquid bulk">Liquid Bulk</option>
                            <option value="dangerous">Dangerous</option>
                            <option value="special purpose">Special Purpose</option>
                            <option value="livestock">Livestock</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="filterStartingLocation" className="filter-group">
                        <Form.Label className="filter-label">Starting Location</Form.Label>
                        <Form.Control
                            as="select"
                            name="startingLocation"
                            value={filters.startingLocation}
                            onChange={handleFilterChange}
                            className="filter-input"
                        >
                            <option value="">All</option>
                            {transportData.stops.map((stop) => (
                                <option key={stop.id} value={stop.Name}>{stop.Name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="filterStoppingLocation" className="filter-group">
                        <Form.Label className="filter-label">Stopping Location</Form.Label>
                        <Form.Control
                            as="select"
                            name="stoppingLocation"
                            value={filters.stoppingLocation}
                            onChange={handleFilterChange}
                            className="filter-input"
                        >
                            <option value="">All</option>
                            {transportData.stops.map((stop) => (
                                <option key={stop.id} value={stop.Name}>{stop.Name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="filterDesignatedDriver" className="filter-group">
                        <Form.Label className="filter-label">Designated Driver</Form.Label>
                        <Form.Control
                            as="select"
                            name="designatedDriver"
                            value={filters.designatedDriver}
                            onChange={handleFilterChange}
                            className="filter-input"
                        >
                            <option value="">All</option>
                            {transportData.drivers.map((driver) => (
                                <option key={driver.id} value={driver.Name}>{driver.Name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="filterDesignatedVehicle" className="filter-group">
                        <Form.Label className="filter-label">Designated Vehicle</Form.Label>
                        <Form.Control
                            as="select"
                            name="designatedVehicle"
                            value={filters.designatedVehicle}
                            onChange={handleFilterChange}
                            className="filter-input"
                        >
                            <option value="">All</option>
                            {transportData.vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.Name}>{vehicle.Name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>
                <Button variant="primary" onClick={handleShow} className="mb-3">Add Shipment</Button>
                <div className="table-responsive">
                    <Table striped bordered hover className="mt-4 custom-table">
                        <thead>
                            <tr>
                                <th>Shipment Number</th>
                                <th>Cargo Type</th>
                                <th>Cargo Weight</th>
                                <th>Number of Pallets</th>
                                <th>Designated Driver</th>
                                <th>Designated Vehicle</th>
                                <th>Starting Location</th>
                                <th>Stopping Location</th>
                                <th>Status</th>
                                <th>Intermediary Stops</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShipments.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td>{shipment.ShipmentNumber}</td>
                                    <td>{shipment.CargoType}</td>
                                    <td>{shipment.CargoWeight}</td>
                                    <td>{shipment.NumberOfPallets}</td>
                                    <td>{shipment.DesignatedDriver ? shipment.DesignatedDriver.Name : 'N/A'}</td>
                                    <td>{shipment.DesignatedVehicle ? shipment.DesignatedVehicle.Name : 'N/A'}</td>
                                    <td>{shipment.StartingLocation ? shipment.StartingLocation.Name : 'N/A'}</td>
                                    <td>{shipment.StoppingLocation ? shipment.StoppingLocation.Name : 'N/A'}</td>
                                    <td>{shipment.Status}</td>
                                    <td>
                                        {shipment.IntermediaryStops && shipment.IntermediaryStops.length > 0
                                            ? shipment.IntermediaryStops.map((stop, index) => (
                                                <div key={index}>{stop.Stop.Name}</div>
                                            ))
                                            : 'None'}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button variant="secondary" className="action-button" onClick={() => handleEdit(shipment)}>Edit</Button>
                                            <Button variant="danger" className="action-button" onClick={() => handleDelete(shipment.id)}>Delete</Button>
                                            <Button variant="info" className="action-button" onClick={() => handleView(shipment)}>View</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditMode ? 'Edit Shipment' : 'Add Shipment'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="ShipmentNumber">
                                <Form.Label>Shipment Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ShipmentNumber"
                                    value={newShipment.ShipmentNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="CargoType">
                                <Form.Label>Cargo Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="CargoType"
                                    value={newShipment.CargoType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="perishable">Perishable</option>
                                    <option value="containerized">Containerized</option>
                                    <option value="dry bulk">Dry Bulk</option>
                                    <option value="liquid bulk">Liquid Bulk</option>
                                    <option value="dangerous">Dangerous</option>
                                    <option value="special purpose">Special Purpose</option>
                                    <option value="livestock">Livestock</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="CargoWeight">
                                <Form.Label>Cargo Weight</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="CargoWeight"
                                    value={newShipment.CargoWeight}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="NumberOfPallets">
                                <Form.Label>Number of Pallets</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="NumberOfPallets"
                                    value={newShipment.NumberOfPallets}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="DesignatedDriverId">
                                <Form.Label>Designated Driver</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="DesignatedDriverId"
                                    value={newShipment.DesignatedDriverId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Driver</option>
                                    {transportData.drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.Name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="DesignatedVehicleId">
                                <Form.Label>Designated Vehicle</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="DesignatedVehicleId"
                                    value={newShipment.DesignatedVehicleId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Vehicle</option>
                                    {transportData.vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.Name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="StartingLocationId">
                                <Form.Label>Starting Location</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="StartingLocationId"
                                    value={newShipment.StartingLocationId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {transportData.stops.map((stop) => (
                                        <option key={stop.id} value={stop.id}>
                                            {stop.Name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="StoppingLocationId">
                                <Form.Label>Stopping Location</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="StoppingLocationId"
                                    value={newShipment.StoppingLocationId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {transportData.stops.map((stop) => (
                                        <option key={stop.id} value={stop.id}>
                                            {stop.Name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="Status">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Status"
                                    value={newShipment.Status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Planned">Planned</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Finished">Finished</option>
                                </Form.Control>
                            </Form.Group>
                            <h5>Intermediary Stops</h5>
                            {newShipment.IntermediaryStops.map((stop, index) => (
                                <div key={index} className="intermediary-stop">
                                    <Form.Group controlId={`StopId-${index}`}>
                                        <Form.Label>Stop</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="StopId"
                                            value={stop.StopId || ''}
                                            onChange={(e) => handleStopChange(e, index)}
                                            required
                                        >
                                            <option value="">Select Stop</option>
                                            {transportData.stops.map((stopOption) => (
                                                <option key={stopOption.id} value={stopOption.id}>
                                                    {stopOption.Name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="secondary" onClick={() => handleRemoveStop(index)}>Remove</Button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={handleAddStop}>Add Intermediary Stop</Button>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                                <Button variant="primary" type="submit">Save Shipment</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>View Shipment Route</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentShipment && <TransportMap 
                            coordinates={[
                                [currentShipment.StartingLocation.Latitude, currentShipment.StartingLocation.Longitude],
                                ...currentShipment.IntermediaryStops.map(stop => [stop.Stop.Latitude, stop.Stop.Longitude]),
                                [currentShipment.StoppingLocation.Latitude, currentShipment.StoppingLocation.Longitude]
                            ]}
                            ref={mapRef}
                            setRouteInfo={setRouteInfo} 
                        />}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                        <Button variant="primary" onClick={downloadRoutes}>Download Routes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Shipments;
