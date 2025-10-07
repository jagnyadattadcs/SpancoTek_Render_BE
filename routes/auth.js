const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
console.log("object")
// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route example
router.get("/profile", protect, getProfile);

module.exports = router;
