// client/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import InventoryValue from '../components/Dashboard/InventoryValue';
import CategoryPieChart from '../components/Dashboard/CategoryPieChart';
import LowStockTable from '../components/Dashboard/LowStockTable';
import { productsAPI, dashboardAPI } from '../utils/api';

const DashboardPage = () => {
  const [inventoryData, setInventoryData] = useState({
    totalValue: 0,
    totalProducts: 0,
    totalItems: 0,
  });
  const [categoriesData, setCategoriesData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch inventory value data
        const inventoryRes = await dashboardAPI.getInventoryValue();
        setInventoryData(inventoryRes.data);

        // Fetch category data
        const categoriesRes = await dashboardAPI.getCategorySummary();
        setCategoriesData(categoriesRes.data);

        // Fetch low stock products
        const lowStockRes = await productsAPI.getLowStock();
        setLowStockProducts(lowStockRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container fluid>
      <h1 className="h3 mb-4">Dashboard</h1>

      {/* Render error message if it exists */}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <InventoryValue loading={loading} data={inventoryData} />

      <Row>
        <Col lg={6}>
          <CategoryPieChart loading={loading} data={categoriesData} />
        </Col>
        <Col lg={6}>
          <LowStockTable loading={loading} products={lowStockProducts} />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
