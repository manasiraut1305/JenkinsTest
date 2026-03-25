require("dotenv").config();
const sql = require("mssql");

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: "localhost",
//   database: "NagpurMetro",
//   options: {
//     instanceName: "SQLEXPRESS",
//     encrypt: false,
//     trustServerCertificate: true
//   }
// };
const config = {
  user: "sa",
  password: "sql123#",
  server: "192.168.2.5",
  // server: "59.97.236.98:5000",
  database: "NagpurMetro_New",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function connectDB() {
  if (pool) return pool;
  try {
    pool = await sql.connect(config);
    console.log("Connected to SQL Server with SQL Auth");
    return pool;
  } catch (err) {
    console.error("DB connection failed:");
    console.dir(err, { depth: null });
  }
}

module.exports = { sql, connectDB };
