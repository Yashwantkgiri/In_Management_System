// client/src/components/Dashboard/CategoryPieChart.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { generateChartColors } from '../../utils/helpers';

const CategoryPieChart = ({ loading, data }) => {
  // Transform categories data for the pie chart
  const chartData = data.map(cat => ({
    name: cat._id,
    value: cat.count
  }));

  // Generate colors for the chart
  const colors = generateChartColors(chartData.length);

  return (
    <Card className="mb-4">
      <Card.Header>Product Categories</Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-5">No category data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default CategoryPieChart;
