// client/src/components/Transactions/StockOutForm.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const StockOutForm = ({ products, customers, onSubmit, onCancel }) => {
  const initialState = {
    productId: '',
    quantity: '',
    customerId: '',
    reason: 'sale', // Default reason
    referenceNumber: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Get the selected product
  const selectedProduct = products.find(p => p._id === formData.productId);
  
  // Form validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (selectedProduct && formData.quantity > selectedProduct.quantity) {
      newErrors.quantity = `Not enough stock. Available: ${selectedProduct.quantity}`;
    }
    
    if (formData.reason === 'sale' && !formData.customerId) {
      newErrors.customerId = 'Customer is required for sales';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseFloat(value) || '' : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Find the selected product and customer to include in the submission
      const selectedCustomer = customers.find(c => c._id === formData.customerId);
      
      onSubmit({
        ...formData,
        productName: selectedProduct?.name || 'Unknown Product',
        customerName: selectedCustomer ? 
          `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 
          'No Customer',
        unitPrice: selectedProduct?.price || 0,
        totalPrice: formData.quantity * (selectedProduct?.price || 0)
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Product</Form.Label>
        <Form.Select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          isInvalid={!!errors.productId}
        >
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product._id} value={product._id}>
              {product.name} - Available: {product.quantity}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.productId}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          min="1"
          step="1"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          isInvalid={!!errors.quantity}
        />
        <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Reason</Form.Label>
        <Form.Select
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        >
          <option value="sale">Sale</option>
          <option value="damage">Damaged/Defective</option>
          <option value="return">Return to Supplier</option>
          <option value="adjustment">Inventory Adjustment</option>
          <option value="other">Other</option>
        </Form.Select>
      </Form.Group>

      {formData.reason === 'sale' && (
        <Form.Group className="mb-3">
          <Form.Label>Customer</Form.Label>
          <Form.Select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            isInvalid={!!errors.customerId}
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>
                {customer.firstName} {customer.lastName}
                {customer.company ? ` (${customer.company})` : ''}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.customerId}</Form.Control.Feedback>
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Reference Number</Form.Label>
        <Form.Control
          type="text"
          name="referenceNumber"
          placeholder="Invoice or receipt number"
          value={formData.referenceNumber}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-flex justify-content-end mt-4">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="warning" type="submit">
          Record Stock Out
        </Button>
      </div>

      {selectedProduct && formData.quantity && (
        <div className="mt-3 p-2 bg-light rounded">
          <p className="mb-1">
            <strong>Unit Price: </strong>
            ${selectedProduct.price?.toFixed(2) || '0.00'}
          </p>
          <p className="mb-0">
            <strong>Total Value: </strong>
            ${(formData.quantity * (selectedProduct.price || 0)).toFixed(2)}
          </p>
        </div>
      )}
    </Form>
  );
};

export default StockOutForm;