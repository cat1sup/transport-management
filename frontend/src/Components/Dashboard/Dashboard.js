import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';  
import { Row, Col, Card } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [transportData, setTransportData] = useState({
    stops: [],
    drivers: [],
    vehicles: []
  });

  useEffect(() => {
    if (!isLoggedIn) {
        navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchShipments();
    fetchTransportInfo();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await axios.get('/api/shipments', { withCredentials: true });
      setShipments(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
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

  const statusData = [
    { name: 'Planned', value: shipments.filter(shipment => shipment.Status === 'Planned').length },
    { name: 'Ongoing', value: shipments.filter(shipment => shipment.Status === 'Ongoing').length },
    { name: 'Finished', value: shipments.filter(shipment => shipment.Status === 'Finished').length }
  ];

  const driverData = transportData.drivers.map(driver => ({
    name: driver.Name,
    shipments: shipments.filter(shipment => shipment.DesignatedDriverId === driver.id).length
  }));

  const vehicleData = transportData.vehicles.map(vehicle => ({
    name: vehicle.Name,
    shipments: shipments.filter(shipment => shipment.DesignatedVehicleId === vehicle.id).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard-page">
        <div className="cards-container">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Welcome to the Transport Management Dashboard</Card.Title>
              <Card.Text>
                This dashboard provides an overview of the transportation data, including shipments, drivers, vehicles, and stops.
                Use the graphs below to get insights into the current state of the transportation operations.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Shipment Status Distribution</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Shipments by Driver</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={driverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="shipments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Shipments by Vehicle</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehicleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="shipments" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Shipments Over Time</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={shipments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="NumberOfPallets" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  );
};

export default Dashboard;
