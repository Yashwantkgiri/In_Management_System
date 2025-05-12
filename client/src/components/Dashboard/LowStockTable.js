// client/src/components/Dashboard/LowStockTable.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Table, Badge } from 'react-bootstrap';
import { formatCurrency } from '../../utils/helpers';

const LowStockTable = ({ loading, products }) => {
  return (
    <Card className="mb-4">
      <Card.Header>Low Stock Products</Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-4">No low stock products found</div>
        ) : (
          <div className="table-responsive">
            <Table hover bordered className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <Link to={`/products?id=${product._id}`}>
                        {product.name}
                      </Link>
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <Badge 
                        bg={product.stock <= 0 ? 'danger' : 'warning'}
                      >
                        {product.stock <= 0 ? 'Out of Stock' : 'Low Stock'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>  
        )}
      </Card.Body>
    </Card>
  );
};

export default LowStockTable;