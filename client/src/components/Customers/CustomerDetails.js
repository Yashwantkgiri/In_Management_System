// client/src/components/Customers/CustomerDetails.js
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const CustomerDetails = ({ customer, onEdit, onClose }) => {
  if (!customer) {
    return <div className="text-center py-5">No customer selected</div>;
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Customer Details</h4>
        <div>
          <Button 
            variant="outline-primary" 
            className="me-2" 
            onClick={() => onEdit(customer)}
          >
            <FaEdit /> Edit
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h5>Personal Information</h5>
            <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
            {customer.company && <p><strong>Company:</strong> {customer.company}</p>}
          </Col>
          <Col md={6}>
            <h5>Contact Information</h5>
            {customer.email && (
              <p>
                <FaEnvelope className="me-2" /> 
                {customer.email}
              </p>
            )}
            {customer.phone && (
              <p>
                <FaPhone className="me-2" /> 
                {customer.phone}
              </p>
            )}
          </Col>
        </Row>

        {(customer.address || customer.city || customer.state || customer.zipCode) && (
          <Row className="mt-3">
            <Col>
              <h5>Address</h5>
              <p>
                <FaMapMarkerAlt className="me-2" />
                {customer.address && `${customer.address}, `}
                {customer.city && `${customer.city}, `}
                {customer.state && `${customer.state} `}
                {customer.zipCode && customer.zipCode}
              </p>
            </Col>
          </Row>
        )}

        {customer.notes && (
          <Row className="mt-3">
            <Col>
              <h5>Additional Notes</h5>
              <p>{customer.notes}</p>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default CustomerDetails;