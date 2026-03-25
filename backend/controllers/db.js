require("dotenv").config();
const sql = require("mssql");


// for development purpose only
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port:5000,
  database: process.env.DB_NAME,
  options: {
     encrypt: false,
    trustServerCertificate: true
  }
}; 

// // for localhost use this
// const config = {
//   user: 'shivam',
//   password:  'shivam',
//   server: 'localhost',
//   port: 1433,
//   database: 'NagpurMetro',
//   options: {
//      encrypt: false,
//     trustServerCertificate: true,
//     enableArithAbort: true
//   }
// };

let pool;

async function connectDB() {
  if (pool) return pool;
  try {
    pool = await sql.connect(config);
    console.log("database config", config)
    console.log("Connected to SQL Server with SQL Auth");
    return pool;
  } catch (err) {
    console.error("DB connection failed:");
    console.dir(err, { depth: null });
  }
}

module.exports = { sql, connectDB };