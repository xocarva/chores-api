import mysql from 'mysql2/promise';

const { MYSQL_HOST, MYSQL_ROOT_USER, MYSQL_ROOT_PASSWORD, MYSQL_DATABASE } = process.env;

export const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_ROOT_USER,
  password: MYSQL_ROOT_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

});
