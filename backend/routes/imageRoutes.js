const express = require("express");
const router = express.Router();
const { getImages, addImage, upload, updateImage, toggleVisibility, getAllImages } = require("../controllers/imageController");
// Middleware to get DB pool
const getPool = (req) => req.app.get("db");

// GET all images
router.get("/all", (req, res) => {
  getAllImages(req, res, getPool(req));
});
// GET visible images
router.get("/", (req, res) => {
  getImages(req, res, getPool(req));
});

// POST new image
router.post("/", upload.single('image'), (req, res) => {
  addImage(req, res, req.app.get("db"));
});

// PUT update image
router.post("/:id", upload.single('image'), (req, res) => {
  updateImage(req, res, getPool(req));
});

// DELETE (Toggle visibility)
router.delete("/:id", (req, res) => {
  toggleVisibility(req, res, getPool(req));
});

module.exports = router;