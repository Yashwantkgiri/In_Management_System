// client/src/components/Products/ProductList.js
import React, { useState } from 'react';
import { Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';

const ProductList = ({ products, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Handle confirm delete with a confirmation dialog
  const handleDeleteClick = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      onDelete(productId);
    }
  };

  // Determine stock status based on quantity and reorder level
  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity <= 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (quantity <= reorderLevel) {
      return <Badge bg="warning">Low Stock</Badge>;
    } else {
      return <Badge bg="success">In Stock</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading products...</div>;
  }

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between flex-wrap">
        <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
          <InputGroup.Text id="search-addon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Form.Select 
          style={{ maxWidth: '200px' }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Form.Select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p>No products found. Try adjusting your search or filter.</p>
        </div>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{getStockStatus(product.quantity, product.reorderLevel)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(product)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(product._id, product.name)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProductList;