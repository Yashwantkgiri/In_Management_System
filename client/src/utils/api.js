// Updated utils/api.js
import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling interceptor with more details
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        endpoint: error.config?.url,
        method: error.config?.method
      });
    } else if (error.request) {
      console.error('API Error: No response received', {
        request: error.request,
        endpoint: error.config?.url,
        method: error.config?.method
      });
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  getInventoryValue: () => apiClient.get('/dashboard/inventory-value'),
  getCategorySummary: () => apiClient.get('/dashboard/category-summary'),
};

// Products API
export const productsAPI = {
  getAll: () => apiClient.get('/products'),
  create: (productData) => apiClient.post('/products', productData),
  update: (id, productData) => apiClient.put(`/products/${id}`, productData),
  delete: (id) => apiClient.delete(`/products/${id}`),
  getLowStock: () => apiClient.get('/products/low-stock'),
};

// Customers API
export const customersAPI = {
  getAll: () => apiClient.get('/customers'),
  create: (customerData) => apiClient.post('/customers', customerData),
  update: (id, customerData) => apiClient.put(`/customers/${id}`, customerData),
  delete: (id) => apiClient.delete(`/customers/${id}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => apiClient.get('/transactions'),
  
  // Updated to ensure type is correctly set and sanitize data
  stockIn: (stockInData) => {
    // Ensure all required fields are correctly formatted
    const payload = {
      type: 'stock-in',
      productId: stockInData.productId,
      quantity: Number(stockInData.quantity),
      purchasePrice: Number(stockInData.purchasePrice || stockInData.unitCost), // Support both field names
      supplier: stockInData.supplier || '',
      referenceNumber: stockInData.referenceNumber || '',
      notes: stockInData.notes || ''
    };
    
    console.log('Sending stock-in API request with data:', payload);
    return apiClient.post('/transactions', payload);
  },
  
  stockOut: (stockOutData) => {
    // Ensure all required fields are correctly formatted
    const payload = {
      type: 'stock-out',
      productId: stockOutData.productId,
      quantity: Number(stockOutData.quantity),
      reason: stockOutData.reason || 'sale',
      sellingPrice: Number(stockOutData.sellingPrice || stockOutData.unitPrice || 0),
      // Only include customerId for sales
      ...(stockOutData.reason === 'sale' ? { customerId: stockOutData.customerId } : {}),
      referenceNumber: stockOutData.referenceNumber || '',
      notes: stockOutData.notes || ''
    };
    
    console.log('Sending stock-out API request with data:', payload);
    return apiClient.post('/transactions', payload);
  },
  
  // Add a raw method for custom transaction payloads
  create: (transactionData) => {
    return apiClient.post('/transactions', transactionData);
  }
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
};

// Reports API
export const reportsAPI = {
  getInventoryReport: () => apiClient.get('/reports/inventory'),
  getCustomerReport: () => apiClient.get('/reports/customers'),
  exportReport: (reportType) => apiClient.get(`/reports/export/${reportType}`, {
    responseType: 'blob', // Important for file downloads
  }),
};

export default apiClient;