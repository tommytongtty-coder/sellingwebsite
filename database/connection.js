import mysql from 'mysql2/promise';

let pool;

function mysqlConfig() {
  const env = process.env;
  return {
    host: env['MYSQL_HOST'] || '127.0.0.1',
    port: parseInt(env['MYSQL_PORT'] || '8889', 10),
    user: env['MYSQL_USER'] || 'root',
    password: env['MYSQL_PASSWORD'] || 'root',
    database: env['MYSQL_DATABASE'] || 'marketplace',
    ssl: String(env['MYSQL_SSL'] || '').toLowerCase() === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
  };
}

export async function getDb() {
  if (!pool) {
    const mysqlEnv = mysqlConfig();
    pool = await mysql.createPool({
      host: mysqlEnv.host,
      port: mysqlEnv.port,
      user: mysqlEnv.user,
      password: mysqlEnv.password,
      database: mysqlEnv.database,
      ssl: mysqlEnv.ssl,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log(
      `MySQL connected → ${mysqlEnv.host}:${mysqlEnv.port}/${mysqlEnv.database}`
    );
  }
  return pool;
}
