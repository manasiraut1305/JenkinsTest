require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ CORS
const allowedOrigins = process.env.CLIENT_URL.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/annualReport", require("./routes/annualReportRoutes"));
app.use("/images", require("./routes/imageRoutes"));
app.use("/login", require("./routes/loginRoutes"));

module.exports = app;
