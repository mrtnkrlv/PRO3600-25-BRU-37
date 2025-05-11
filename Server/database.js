import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config(); // No path needed

/**
 * @module database
 */

/**
 * Pool de connexions MySQL pour accéder à la base de données.
 * @type {object}
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

export default pool;