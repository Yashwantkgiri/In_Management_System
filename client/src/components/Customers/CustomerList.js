// client/src/components/Customers/CustomerList.js
import React, { useState } from 'react';
import { Table, InputGroup, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const CustomerList = ({ customers, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 🔍 Filter Logic with Proper Null Checks
  const filteredCustomers = customers.filter((customer) =>
    (customer?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (customer?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (customer?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-5">Loading customers...</div>;
  }

  return (
    <div>
      <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
        <InputGroup.Text id="search-addon">
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-5">
          <p>No customers found. Try adjusting your search.</p>
        </div>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer?.firstName || 'N/A'}</td>
                <td>{customer?.lastName || 'N/A'}</td>
                <td>{customer?.email || 'N/A'}</td>
                <td>{customer?.phone || 'N/A'}</td>
                <td>{customer?.address || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CustomerList;
