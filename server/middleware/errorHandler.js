// server/middleware/errorHandler.js

/**
 * Middleware for handling errors globally.
 * This should be the last middleware added to the Express app.
 */

// Custom Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error(`⚠️  Error: ${err.message}`);
  
    // Set the status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    // Send JSON response with error message
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  };
  
  module.exports = errorHandler;
  