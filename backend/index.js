const app = require("./app");
const { connectDB } = require("./db");

const PORT = 5050;

(async () => {
  const pool = await connectDB();

  if (pool) {
    app.set("db", pool);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } else {
    console.error("❌ Failed to connect to database.");
  }
})();
