const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Initialize express app
const app = express();

// Connect to Database
connectDB()
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ Error connecting to MongoDB:", err.message);
        process.exit(1);  // Exit process with failure
    });

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Removed { extended: false }

// Define Routes
app.use('/api/products', require('./routes/api/products'));
app.use('/api/customers', require('./routes/api/customers'));
app.use('/api/transactions', require('./routes/api/transactions'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
}

// Error handling middleware
app.use(errorHandler);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
