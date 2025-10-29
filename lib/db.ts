import sql from 'mssql';

const config = {
  user: 'sa',
  password: 'Thanhtam123@',
  server: 'localhost', // hoặc IP container
  database: 'ECommerceDB',
  options: {
    encrypt: false,            // false nếu local dev
    trustServerCertificate: true
  }
}

export async function getConnection() {
  try {
    const pool = await sql.connect(config)
    return pool
  } catch (err) {
    console.error('Database connection failed:', err)
  }
}
