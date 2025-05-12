// Fixed StockInForm.js
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const StockInForm = ({ products, onSubmit, onCancel }) => {
  const initialState = {
    productId: '',
    quantity: '',
    unitCost: '',
    supplier: '',
    referenceNumber: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Form validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData.unitCost || formData.unitCost <= 0) {
      newErrors.unitCost = 'Unit cost must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'unitCost' 
        ? parseFloat(value) || '' 
        : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Find the selected product to include in the submission
      const selectedProduct = products.find(p => p._id === formData.productId);
      
      // Format the data correctly for the API
      const submissionData = {
        type: 'stock-in',  // Explicitly set the type
        productId: formData.productId,
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.unitCost), // Use the expected field name
        supplier: formData.supplier || '',
        referenceNumber: formData.referenceNumber || '',
        notes: formData.notes || '',
        // Include additional fields for display purposes
        productName: selectedProduct?.name || 'Unknown Product',
        totalCost: Number(formData.quantity) * Number(formData.unitCost)
      };
      
      console.log('Submitting transaction data:', submissionData);
      onSubmit(submissionData);
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
              {product.name} - Current stock: {product.quantity}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.productId}</Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
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
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Unit Cost</Form.Label>
            <Form.Control
              type="number"
              min="0.01"
              step="0.01"
              name="unitCost"
              value={formData.unitCost}
              onChange={handleChange}
              isInvalid={!!errors.unitCost}
            />
            <Form.Control.Feedback type="invalid">{errors.unitCost}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Supplier</Form.Label>
        <Form.Control
          type="text"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Reference Number</Form.Label>
        <Form.Control
          type="text"
          name="referenceNumber"
          placeholder="Invoice or PO number"
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
        <Button variant="success" type="submit">
          Record Stock In
        </Button>
      </div>

      {formData.quantity && formData.unitCost && (
        <div className="mt-3 p-2 bg-light rounded">
          <strong>Total Cost: </strong>
          ${(formData.quantity * formData.unitCost).toFixed(2)}
        </div>
      )}
    </Form>
  );
};

export default StockInForm;