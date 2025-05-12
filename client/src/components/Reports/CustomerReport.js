// client/src/components/Reports/CustomerReport.js
import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Form } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';
import Papa from 'papaparse';

const CustomerReport = ({ customers, transactions }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Calculate customer-specific metrics
  const customerMetrics = useMemo(() => {
    const customerTransactions = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'stock-out' && transaction.customerId) {
        const customerId = transaction.customerId;
        if (!acc[customerId]) {
          acc[customerId] = {
            totalPurchases: 0,
            totalItems: 0,
            transactions: []
          };
        }
        acc[customerId].totalPurchases += transaction.sellingPrice * transaction.quantity;
        acc[customerId].totalItems += transaction.quantity;
        acc[customerId].transactions.push(transaction);
      }
      return acc;
    }, {});

    const enrichedCustomers = customers.map(customer => ({
      ...customer,
      ...customerTransactions[customer._id],
      totalPurchases: customerTransactions[customer._id]?.totalPurchases || 0,
      totalItems: customerTransactions[customer._id]?.totalItems || 0
    }));

    return {
      totalCustomers: customers.length,
      topCustomers: enrichedCustomers
        .sort((a, b) => b.totalPurchases - a.totalPurchases)
        .slice(0, 5),
      enrichedCustomers
    };
  }, [customers, transactions]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    return customerMetrics.enrichedCustomers
      .filter(customer => {
        switch (filterType) {
          case 'active':
            return customer.totalPurchases > 0;
          case 'inactive':
            return customer.totalPurchases === 0;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            break;
          case 'purchases':
            comparison = b.totalPurchases - a.totalPurchases;
            break;
          case 'items':
            comparison = b.totalItems - a.totalItems;
            break;
          default: // ✅ Added default case to handle unexpected values
            comparison = 0;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [customerMetrics.enrichedCustomers, filterType, sortBy, sortDirection]);

  // Export to CSV
  const handleExportCSV = () => {
    const csvData = filteredCustomers.map(customer => ({
      'First Name': customer.firstName,
      'Last Name': customer.lastName,
      'Email': customer.email,
      'Phone': customer.phone,
      'Company': customer.company || 'N/A',
      'Total Purchases': formatCurrency(customer.totalPurchases),
      'Total Items Purchased': customer.totalItems
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customer_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Customer Metrics Cards */}
      <div className="mb-4 d-flex justify-content-between">
        <Card className="me-2 flex-grow-1">
          <Card.Body>
            <Card.Title>Total Customers</Card.Title>
            <h3>{customerMetrics.totalCustomers}</h3>
          </Card.Body>
        </Card>
        <Card className="me-2 flex-grow-1">
          <Card.Body>
            <Card.Title>Top Customer</Card.Title>
            <h3>
              {customerMetrics.topCustomers.length > 0 
                ? `${customerMetrics.topCustomers[0].firstName} ${customerMetrics.topCustomers[0].lastName}` 
                : 'N/A'}
            </h3>
            <p>
              {customerMetrics.topCustomers.length > 0 
                ? formatCurrency(customerMetrics.topCustomers[0].totalPurchases)
                : ''}
            </p>
          </Card.Body>
        </Card>
        <Card className="me-2 flex-grow-1">
          <Card.Body>
            <Card.Title>Active Customers</Card.Title>
            <h3>
              {customerMetrics.enrichedCustomers.filter(c => c.totalPurchases > 0).length}
            </h3>
          </Card.Body>
        </Card>
        <Card className="flex-grow-1">
          <Card.Body>
            <Card.Title>Total Sales</Card.Title>
            <h3>
              {formatCurrency(
                customerMetrics.enrichedCustomers.reduce((sum, c) => sum + c.totalPurchases, 0)
              )}
            </h3>
          </Card.Body>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <Form.Select 
            className="me-2"
            style={{ width: '200px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="active">Active Customers</option>
            <option value="inactive">Inactive Customers</option>
          </Form.Select>

          <Form.Select 
            className="me-2"
            style={{ width: '200px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="purchases">Sort by Total Purchases</option>
            <option value="items">Sort by Items Purchased</option>
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

      {/* Customers Table */}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Total Purchases</th>
            <th>Items Purchased</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.firstName} {customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.phone || 'N/A'}</td>
              <td>{customer.company || 'N/A'}</td>
              <td>{formatCurrency(customer.totalPurchases)}</td>
              <td>{customer.totalItems}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerReport;
