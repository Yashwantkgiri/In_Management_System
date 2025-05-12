import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp 
} from 'lucide-react';
import { dashboardAPI } from '../../utils/api';
import InventoryValue from './InventoryValue';
import CategoryPieChart from './CategoryPieChart';
import LowStockTable from './LowStockTable';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalValue: 0,
    productCount: 0,
    customerCount: 0,
    transactionCount: 0,
    categorySummary: [] // ✅ Added for CategoryPieChart
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          summaryResponse,
          inventoryValueResponse,
          // categorySummaryResponse   // ✅ Uncomment if needed
        ] = await Promise.all([
          dashboardAPI.getSummary(),
          dashboardAPI.getInventoryValue(),
          // dashboardAPI.getCategorySummary()   // ✅ Uncomment if needed
        ]);

        setDashboardData({
          totalValue: inventoryValueResponse.data.totalValue,
          productCount: summaryResponse.data.productCount,
          customerCount: summaryResponse.data.customerCount,
          transactionCount: summaryResponse.data.transactionCount,
          // categorySummary: categorySummaryResponse.data  // ✅ Uncomment if needed
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>

      {/* Key Metrics Cards */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-icon bg-primary">
            <DollarSign size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Inventory Value</h3>
            <p>${dashboardData.totalValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-success">
            <Package size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Products</h3>
            <p>{dashboardData.productCount}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-info">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Customers</h3>
            <p>{dashboardData.customerCount}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-warning">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>Transactions</h3>
            <p>{dashboardData.transactionCount}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="dashboard-widgets">
        <div className="widget-column">
          <InventoryValue />
          <CategoryPieChart data={dashboardData.categorySummary} /> {/* ✅ Pass it as a prop */}
        </div>
        
        <div className="widget-column">
          <LowStockTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
