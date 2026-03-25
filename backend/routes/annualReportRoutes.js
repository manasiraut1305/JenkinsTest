const express = require("express");
const router = express.Router();
const controller = require("../controllers/annualReportController");

/* ➕ Add annual report */
router.post("/", (req, res) => {
  controller.addAnnualReport(req, res, req.app.get("db"));
});

/* 📄 Get ALL annual reports (admin) */
router.get("/all", (req, res) => {
  controller.getAnnualReportAdmin(req, res, req.app.get("db"));
});

/* ✅ Get ONLY active annual reports */
router.get("/", (req, res) => {
  controller.getActiveAnnualReportAdmin(req, res, req.app.get("db"));
});

/* ✏️ Update annual report */
router.post("/:id", (req, res) => {
  controller.updateAnnualReport(req, res, req.app.get("db"));
});

/* 🗑️ Toggle delete (soft delete) */
router.delete("/:id", (req, res) => {
  controller.toggleAnnualReportDelete(req, res, req.app.get("db"));
});

module.exports = router;