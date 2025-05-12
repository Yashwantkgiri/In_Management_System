import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import InventoryReport from '../components/Reports/InventoryReport';
import CustomerReport from '../components/Reports/CustomerReport';
import { reportsAPI } from '../utils/api';

const ReportsPage = () => {
  const [inventoryReportData, setInventoryReportData] = useState([]);
  const [customerReportData, setCustomerReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReport, setActiveReport] = useState('inventory');

  // ========== FETCH REPORT DATA ==========
  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel API calls for different reports
      const [inventoryReportResponse, customerReportResponse] = await Promise.all([
        reportsAPI.getInventoryReport(),
        reportsAPI.getCustomerReport(),
      ]);

      setInventoryReportData(inventoryReportResponse.data || []);
      setCustomerReportData(customerReportResponse.data || []);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchReportData();
  }, []);

  // ========== EXPORT REPORT HANDLER ==========
  const handleExportReport = async (reportType) => {
    try {
      // Check if there is data to export
      if (
        (reportType === 'inventory' && inventoryReportData.length === 0) ||
        (reportType === 'customer' && customerReportData.length === 0)
      ) {
        setError(`No data available to export for ${reportType} report.`);
        return;
      }

      const response = await reportsAPI.exportReport(reportType);

      // Create a blob and trigger download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Error exporting ${reportType} report:`, err);
      setError(`Failed to export ${reportType} report. Please try again.`);
    }
  };

  // ========== RENDER ==========
  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Reports</h1>
        <div>
          <Button
            variant="outline-primary"
            className={`me-2 ${activeReport === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveReport('inventory')}
          >
            Inventory Report
          </Button>
          <Button
            variant="outline-primary"
            className={activeReport === 'customer' ? 'active' : ''} 
            onClick={() => setActiveReport('customer')}
          >
            Customer Report
          </Button>
          <Button 
            variant="outline-secondary" 
            className="ms-2" 
            onClick={fetchReportData}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {/* Loading Spinner */}
      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>{activeReport === 'inventory' ? 'Inventory Report' : 'Customer Report'}</h4>
            <Button 
              variant="success" 
              onClick={() => handleExportReport(activeReport)}
              disabled={
                (activeReport === 'inventory' && inventoryReportData.length === 0) || 
                (activeReport === 'customer' && customerReportData.length === 0)
              }
            >
              Export to Excel
            </Button>
          </Card.Header>
          <Card.Body>
            {activeReport === 'inventory' ? (
              inventoryReportData.length > 0 ? (
                <InventoryReport data={inventoryReportData} />
              ) : (
                <div className="text-center text-muted">No inventory data available.</div>
              )
            ) : (
              customerReportData.length > 0 ? (
                <CustomerReport data={customerReportData} />
              ) : (
                <div className="text-center text-muted">No customer data available.</div>
              )
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ReportsPage;
