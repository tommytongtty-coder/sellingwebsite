import mysql from 'mysql2/promise';
import config from '../config/config';

let pool;

export async function getDb() {
  if (!pool) {
    pool = await mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log(
      `MySQL connected → ${config.mysql.host}:${config.mysql.port}/${config.mysql.database}`
    );
  }
  return pool;
}
