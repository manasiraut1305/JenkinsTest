const express = require("express");
const router = express.Router();
const { loginUser} = require("../controllers/loginController");


router.post("/", (req, res) => {
  const pool = req.app.get("db");
  loginUser(req, res,pool);
});


module.exports = router;


