// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Layout Components
import Layout from './components/Layout/Layout';

// Pages
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';

// Context Providers
import { ProductProvider } from './context/ProductContext';
import { CustomerProvider } from './context/CustomerContext';
import { TransactionProvider } from './context/TransactionContext';

// Styles
import './App.css';


function App() {
  return (
    <Router>
      <ProductProvider>
        <CustomerProvider>
          <TransactionProvider>
            <Layout>
              <Container fluid className="main-content p-4">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Routes>
              </Container>
            </Layout>
          </TransactionProvider>
        </CustomerProvider>
      </ProductProvider>
    </Router>
  );
}

export default App;