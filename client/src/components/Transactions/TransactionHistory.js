// client/src/components/Transactions/TransactionHistory.js
import React, { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';

const TransactionHistory = ({ transactions, loading, products, customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Helper function to get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  };

  // Helper function to get customer name by ID
  const getCustomerName = (customerId) => {
    if (!customerId) return 'N/A';
    const customer = customers.find(c => c._id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      getProductName(transaction.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(transaction.customerId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = transactionType 
      ? transaction.type === transactionType 
      : true;
    
    const matchesDate = dateFilter
      ? new Date(transaction.transactionDate).toISOString().split('T')[0] === dateFilter
      : true;
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Render transaction type badge
  const renderTransactionTypeBadge = (type) => {
    switch(type) {
      case 'stock-in':
        return <Badge bg="success">Stock In</Badge>;
      case 'stock-out':
        return <Badge bg="warning">Stock Out</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading transactions...</div>;
  }

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between flex-wrap">
        <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
          <InputGroup.Text id="search-addon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <div className="d-flex">
          <Form.Select 
            className="me-2"
            style={{ maxWidth: '200px' }}
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="">All Transactions</option>
            <option value="stock-in">Stock In</option>
            <option value="stock-out">Stock Out</option>
          </Form.Select>

          <Form.Control
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ maxWidth: '200px' }}
          />
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-5">
          <p>No transactions found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Customer/Supplier</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                <td>{renderTransactionTypeBadge(transaction.type)}</td>
                <td>{getProductName(transaction.productId)}</td>
                <td>{transaction.quantity}</td>
                <td>
                  {transaction.type === 'stock-in' 
                    ? formatCurrency(transaction.purchasePrice) 
                    : formatCurrency(transaction.sellingPrice)}
                </td>
                <td>
                  {transaction.type === 'stock-in' 
                    ? (transaction.supplier || 'N/A') 
                    : getCustomerName(transaction.customerId)}
                </td>
                <td>{transaction.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TransactionHistory;
