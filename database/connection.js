import mysql from 'mysql2/promise';

let pool;

function envStore() {
  return (typeof global !== 'undefined' && global.process && global.process.env)
    ? global.process.env
    : process.env;
}

function readEnv(names, fallback) {
  const env = envStore();
  const keys = Array.isArray(names) ? names : [names];
  for (const key of keys) {
    const value = env[key];
    if (value != null && value !== '') return value;
  }
  return fallback;
}

function mysqlConfig() {
  return {
    host: readEnv(['MYSQL_HOST', 'DB_HOST'], '127.0.0.1'),
    port: parseInt(readEnv(['MYSQL_PORT', 'DB_PORT'], '8889'), 10),
    user: readEnv(['MYSQL_USER', 'DB_USER'], 'root'),
    password: readEnv(['MYSQL_PASSWORD', 'DB_PASSWORD'], 'root'),
    database: readEnv(['MYSQL_DATABASE', 'DB_NAME'], 'marketplace'),
    ssl: String(readEnv(['MYSQL_SSL', 'DB_SSL'], '')).toLowerCase() === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
  };
}

export async function getDb() {
  if (!pool) {
    const mysqlEnv = mysqlConfig();
    console.log(
      `[env] host=${mysqlEnv.host} port=${mysqlEnv.port} database=${mysqlEnv.database}`
    );
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
