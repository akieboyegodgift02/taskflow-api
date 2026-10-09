import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for cloud providers like Neon
  },
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL Database successfully!');
});

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected database error on idle client', err);
  process.exit(-1);
});