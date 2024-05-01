import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import './NavigationBar.css';

function NavigationBar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log('Logging out...');
    navigate('/login');  // Redirect to login page after logout
  };
  console.log('Is logged in:', isLoggedIn);
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="custom-navbar">
      <LinkContainer to="/dashboard">
        <Navbar.Brand>Transport Management</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <LinkContainer to="/dashboard">
            <Nav.Link>Dashboard</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/routes">
            <Nav.Link>Routes</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/shipments">
            <Nav.Link>Shipments</Nav.Link>
          </LinkContainer>
          <NavDropdown title="Account" id="basic-nav-dropdown">
            <LinkContainer to="/profile-settings">
              <NavDropdown.Item>Profile Settings</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
