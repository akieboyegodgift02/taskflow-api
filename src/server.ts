import app from './app.js';
import { pool } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("🔍 Checking environment variables...");
console.log("DATABASE_URL is loaded:", process.env.DATABASE_URL ? "Yes ✅" : "No ❌ (Check your .env file!)");

const startServer = async () => {
  try {
    console.log("⏳ Attempting to connect to database...");
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('🗄️ Database connection verified successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();