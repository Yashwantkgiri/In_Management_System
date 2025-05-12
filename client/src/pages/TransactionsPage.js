// Improved TransactionsPage.js with better error handling and fixed payload structure
import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import StockInForm from '../components/Transactions/StockInForm';
import StockOutForm from '../components/Transactions/StockOutForm';
import TransactionHistory from '../components/Transactions/TransactionHistory';
import { productsAPI, customersAPI, transactionsAPI } from '../utils/api';

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, customersRes, transactionsRes] = await Promise.all([
          productsAPI.getAll(),
          customersAPI.getAll(),
          transactionsAPI.getAll()
        ]);
        
        setProducts(productsRes.data);
        setCustomers(customersRes.data);
        setTransactions(transactionsRes.data);
      } catch (err) {
        console.error("Error loading transaction data:", err);
        setError("Failed to load data. Please try again later.");
        toast.error("Failed to load transaction data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStockInSubmit = async (stockInData) => {
    try {
      console.log("Submitting stock in data:", stockInData);
      
      // Data validation and type conversion
      if (!stockInData.productId) {
        toast.error("Product selection is required");
        return;
      }
      
      const quantity = Number(stockInData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        toast.error("Quantity must be a positive number");
        return;
      }
      
      const purchasePrice = Number(stockInData.purchasePrice || stockInData.unitCost || 0);
      if (isNaN(purchasePrice) || purchasePrice < 0) {
        toast.error("Purchase price must be a valid number");
        return;
      }
      
      // Format payload to match API expectations
      const stockInPayload = {
        productId: stockInData.productId,
        quantity: quantity,
        purchasePrice: purchasePrice,
        type: 'stock-in', // Ensure this matches what backend expects
        notes: stockInData.notes || '',
        referenceNumber: stockInData.referenceNumber || '',
        supplier: stockInData.supplier || ''
      };
      
      console.log("Formatted stock in payload:", stockInPayload);
      const response = await transactionsAPI.stockIn(stockInPayload);
      console.log("Stock in recorded:", response.data);
      
      // Update local state
      setTransactions([response.data, ...transactions]);
      
      // Switch to history tab
      setActiveTab('history');
      
      toast.success("Stock in recorded successfully!");
    } catch (error) {
      console.error("Error recording stock in:", error);
      
      // Enhanced error handling and display
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
        
        // Extract and display validation errors
        let errorMessage = 'Failed to record stock in';
        
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          const errorDetails = error.response.data.errors
            .map(e => e.message || e.msg || e)
            .join(', ');
          errorMessage += `: ${errorDetails}`;
        } else if (error.response.data.message) {
          errorMessage += `: ${error.response.data.message}`;
        }
        
        toast.error(errorMessage);
      } else {
        toast.error(`Failed to record stock in: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleStockOutSubmit = async (stockOutData) => {
    try {
      console.log("Submitting stock out data:", stockOutData);
      
      // Data validation
      if (!stockOutData.productId) {
        toast.error("Product selection is required");
        return;
      }
      
      const quantity = Number(stockOutData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        toast.error("Quantity must be a positive number");
        return;
      }
      
      const sellingPrice = Number(stockOutData.sellingPrice || stockOutData.unitPrice || 0);
      if (isNaN(sellingPrice) || sellingPrice < 0) {
        toast.error("Selling price must be a valid number");
        return;
      }
      
      if (!stockOutData.reason) {
        toast.error("Reason for stock out is required");
        return;
      }
      
      // Make sure the required fields are present and properly formatted
      const stockOutPayload = {
        productId: stockOutData.productId,
        quantity: quantity,
        type: 'stock-out', // Ensure this matches what backend expects
        reason: stockOutData.reason,
        sellingPrice: sellingPrice,
        customerId: stockOutData.reason === 'sale' && stockOutData.customerId ? stockOutData.customerId : null,
        referenceNumber: stockOutData.referenceNumber || '',
        notes: stockOutData.notes || ''
      };
      
      console.log("Formatted stock out payload:", stockOutPayload);
      const response = await transactionsAPI.stockOut(stockOutPayload);
      console.log("Stock out recorded:", response.data);
      
      // Update local state
      setTransactions([response.data, ...transactions]);
      
      // Switch to history tab
      setActiveTab('history');
      
      toast.success("Stock out recorded successfully!");
    } catch (error) {
      console.error("Error recording stock out:", error);
      
      // Enhanced error handling and display
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
        
        // Extract and display validation errors
        let errorMessage = 'Failed to record stock out';
        
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          const errorDetails = error.response.data.errors
            .map(e => e.message || e.msg || e)
            .join(', ');
          errorMessage += `: ${errorDetails}`;
        } else if (error.response.data.message) {
          errorMessage += `: ${error.response.data.message}`;
        }
        
        toast.error(errorMessage);
      } else {
        toast.error(`Failed to record stock out: ${error.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Inventory Transactions</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="history" title="Transaction History">
          <TransactionHistory 
            transactions={transactions} 
            loading={loading} 
            products={products}
            customers={customers}
          />
        </Tab>
        <Tab eventKey="stockIn" title="Record Stock In">
          <StockInForm 
            products={products} 
            onSubmit={handleStockInSubmit}
            onCancel={() => setActiveTab('history')}
          />
        </Tab>
        <Tab eventKey="stockOut" title="Record Stock Out">
          <StockOutForm 
            products={products} 
            customers={customers}
            onSubmit={handleStockOutSubmit}
            onCancel={() => setActiveTab('history')}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default TransactionsPage;