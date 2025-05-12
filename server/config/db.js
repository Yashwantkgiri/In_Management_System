const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // 🔥 Simplified connection without deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // 🔴 Exit process with failure
  }
};

module.exports = connectDB;
