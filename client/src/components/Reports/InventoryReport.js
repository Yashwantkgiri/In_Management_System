// client/src/components/Reports/InventoryReport.js
import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Form } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';
import Papa from 'papaparse';

const InventoryReport = ({ data }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // ✅ **Initialize products safely and memoize it**
  const products = useMemo(() => data || [], [data]);

  // ✅ **Calculate aggregate inventory metrics safely**
  const inventoryMetrics = useMemo(() => {
    if (products.length === 0) return {
      totalProducts: 0,
      totalInventoryValue: 0,
      outOfStockProducts: 0,
      lowStockProducts: 0
    };

    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, product) => 
      sum + (product.quantity * product.costPrice), 0);
    const outOfStockProducts = products.filter(p => p.quantity <= 0).length;
    const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= p.reorderLevel).length;

    return {
      totalProducts,
      totalInventoryValue,
      outOfStockProducts,
      lowStockProducts
    };
  }, [products]);

  // ✅ **Filter and sort products safely**
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];

    return products
      .filter(product => {
        switch (filterStatus) {
          case 'in-stock':
            return product.quantity > product.reorderLevel;
          case 'low-stock':
            return product.quantity > 0 && product.quantity <= product.reorderLevel;
          case 'out-of-stock':
            return product.quantity <= 0;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'quantity':
            comparison = a.quantity - b.quantity;
            break;
          case 'value':
            comparison = (a.quantity * a.costPrice) - (b.quantity * b.costPrice);
            break;
          default:
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [products, filterStatus, sortBy, sortDirection]);

  // ✅ **Export to CSV**
  const handleExportCSV = () => {
    if (filteredProducts.length === 0) return;

    const csvData = filteredProducts.map(product => ({
      SKU: product.sku,
      Name: product.name,
      Category: product.category,
      Quantity: product.quantity,
      'Reorder Level': product.reorderLevel,
      'Cost Price': product.costPrice,
      'Total Value': product.quantity * product.costPrice,
      Supplier: product.supplier || 'N/A'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventory_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Inventory Metrics Cards */}
      <div className="mb-4 d-flex justify-content-between">
        <Card className="me-2 flex-grow-1">
          <Card.Body>
            <Card.Title>Total Products</Card.Title>
            <h3>{inventoryMetrics.totalProducts}</h3>
          </Card.Body>
        </Card>
        <Card className="me-2 flex-grow-1">
          <Card.Body>
            <Card.Title>Total Inventory Value</Card.Title>
            <h3>{formatCurrency(inventoryMetrics.totalInventoryValue)}</h3>
          </Card.Body>
        </Card>
        <Card className="me-2 flex-grow-1">
          <Card.Body>
            <Card.Title>Out of Stock</Card.Title>
            <h3>{inventoryMetrics.outOfStockProducts}</h3>
          </Card.Body>
        </Card>
        <Card className="flex-grow-1">
          <Card.Body>
            <Card.Title>Low Stock</Card.Title>
            <h3>{inventoryMetrics.lowStockProducts}</h3>
          </Card.Body>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <Form.Select 
            className="me-2"
            style={{ width: '200px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </Form.Select>

          <Form.Select 
            className="me-2"
            style={{ width: '200px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="value">Sort by Total Value</option>
          </Form.Select>

          <Button 
            variant="outline-secondary"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? '▲' : '▼'}
          </Button>
        </div>

        <Button variant="outline-primary" onClick={handleExportCSV}>
          <FaDownload className="me-2" /> Export to CSV
        </Button>
      </div>

      {/* Inventory Table */}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
            <th>Cost Price</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>{product.reorderLevel}</td>
              <td>{formatCurrency(product.costPrice)}</td>
              <td>{formatCurrency(product.quantity * product.costPrice)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InventoryReport;
