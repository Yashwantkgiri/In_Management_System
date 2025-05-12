// client/src/components/Products/ProductItem.js
import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { FaBox, FaTag, FaDollarSign, FaWarehouse } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';

const ProductItem = ({ product }) => {
  // Determine stock status
  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity <= 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (quantity <= reorderLevel) {
      return <Badge bg="warning">Low Stock</Badge>;
    } else {
      return <Badge bg="success">In Stock</Badge>;
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>{product.name}</h4>
        {getStockStatus(product.quantity, product.reorderLevel)}
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h5>Product Details</h5>
            <p>
              <FaTag className="me-2" />
              <strong>SKU:</strong> {product.sku}
            </p>
            <p>
              <FaBox className="me-2" />
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <FaDollarSign className="me-2" />
              <strong>Price:</strong> {formatCurrency(product.price)}
            </p>
            <p>
              <FaDollarSign className="me-2" />
              <strong>Cost Price:</strong> {formatCurrency(product.costPrice)}
            </p>
          </Col>
          <Col md={6}>
            <h5>Inventory Information</h5>
            <p>
              <FaBox className="me-2" />
              <strong>Quantity:</strong> {product.quantity}
            </p>
            <p>
              <FaWarehouse className="me-2" />
              <strong>Reorder Level:</strong> {product.reorderLevel}
            </p>
            {product.location && (
              <p>
                <FaWarehouse className="me-2" />
                <strong>Storage Location:</strong> {product.location}
              </p>
            )}
          </Col>
        </Row>

        {product.description && (
          <Row className="mt-3">
            <Col>
              <h5>Description</h5>
              <p>{product.description}</p>
            </Col>
          </Row>
        )}

        {product.supplier && (
          <Row className="mt-3">
            <Col>
              <h5>Supplier Information</h5>
              <p>{product.supplier}</p>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductItem;