// client/src/components/Layout/Layout.js
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="layout-container">
      {/* Navbar with toggle functionality */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Main Container */}
      <Container fluid className="p-0">
        <Row className="g-0">
          
          {/* Sidebar Column */}
          <Col 
            className={`sidebar-col ${sidebarOpen ? 'd-block' : 'd-none d-md-block'}`} 
            xs={12} 
            md={sidebarOpen ? 3 : 0} 
            lg={sidebarOpen ? 2 : 0}
          >
            <Sidebar />
          </Col>

          {/* Main Content Column */}
          <Col 
            className="main-content-col" 
            xs={12} 
            md={sidebarOpen ? 9 : 12} 
            lg={sidebarOpen ? 10 : 12}
          >
            <main className="p-4">{children}</main>
          </Col>
          
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
