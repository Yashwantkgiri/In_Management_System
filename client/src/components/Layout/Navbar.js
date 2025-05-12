// client/src/components/Layout/Navbar.js
import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaBars, FaUserCircle, FaBell, FaSearch } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  return (
    <BootstrapNavbar bg="white" expand="lg" className="border-bottom shadow-sm">
      <Container fluid>
        <Button 
          variant="outline-secondary" 
          className="border-0 me-3"
          onClick={toggleSidebar}
        >
          <FaBars />
        </Button>
        
        <BootstrapNavbar.Brand href="/">Inventory Management</BootstrapNavbar.Brand>
        
        <div className="d-none d-md-flex ms-auto me-4 position-relative">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search..." 
            aria-label="Search"
          />
          <FaSearch className="position-absolute" style={{ right: '10px', top: '10px', opacity: 0.5 }} />
        </div>
        
        <Nav className="ms-auto">
          <Nav.Link href="#" className="d-flex align-items-center">
            <FaBell className="fs-5" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </Nav.Link>
          
          <Dropdown align="end">
            <Dropdown.Toggle as="a" className="nav-link d-flex align-items-center" id="dropdown-user">
              <FaUserCircle className="fs-4 me-1" />
              <span className="d-none d-md-inline">Admin</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#profile">Profile</Dropdown.Item>
              <Dropdown.Item href="#settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;