import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import './NavigationBar.css';  // Assuming you have a CSS file for custom styles

function NavigationBar() {
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return null;  // Do not render the navbar if the user is not logged in
  }

  const handleLogout = () => {
    logout();
    console.log('Logging out...');
  };

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
