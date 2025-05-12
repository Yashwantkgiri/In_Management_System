// client/src/pages/CustomersPage.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import CustomerList from '../components/Customers/CustomerList';
import CustomerForm from '../components/Customers/CustomerForm';
import CustomerDetails from '../components/Customers/CustomerDetails';
import { customersAPI } from '../utils/api';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Create customer handler
  const handleCreateCustomer = async (customerData) => {
    try {
      const response = await customersAPI.create(customerData);
      setCustomers([...customers, response.data]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('Failed to create customer. Please try again.');
    }
  };

  // Update customer handler
  const handleUpdateCustomer = async (customerData) => {
    try {
      const response = await customersAPI.update(selectedCustomer._id, customerData);
      setCustomers(customers.map(c => 
        c._id === selectedCustomer._id ? response.data : c
      ));
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Failed to update customer. Please try again.');
    }
  };

  // Delete customer handler
  const handleDeleteCustomer = async (customerId) => {
    try {
      await customersAPI.delete(customerId);
      setCustomers(customers.filter(c => c._id !== customerId));
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer. Please try again.');
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Customers</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
        >
          Add New Customer
        </Button>
      </div>

      {/* {error && <div className="alert alert-danger">{error}</div>} */}

      <CustomerList 
        customers={customers}
        loading={loading}
        onEdit={(customer) => {
          setSelectedCustomer(customer);
          setShowEditModal(true);
        }}
        onDelete={handleDeleteCustomer}
        onViewDetails={(customer) => {
          setSelectedCustomer(customer);
          setShowDetailsModal(true);
        }}
      />

      {/* Create Customer Modal */}
      <Modal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerForm 
            isEditing={false}
            onSubmit={handleCreateCustomer}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => {
          setShowEditModal(false);
          setSelectedCustomer(null);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerForm 
            customer={selectedCustomer}
            isEditing={true}
            onSubmit={handleUpdateCustomer}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedCustomer(null);
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Customer Details Modal */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => {
          setShowDetailsModal(false);
          setSelectedCustomer(null);
        }}
        size="lg"
      >
        <Modal.Body>
          <CustomerDetails 
            customer={selectedCustomer}
            onEdit={(customer) => {
              setShowDetailsModal(false);
              setSelectedCustomer(customer);
              setShowEditModal(true);
            }}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedCustomer(null);
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomersPage;