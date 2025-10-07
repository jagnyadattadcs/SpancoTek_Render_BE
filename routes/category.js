const express = require("express");
const router = express.Router();
const {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const { upload } = require("../config/cloudinary");
const protect = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategory);

// Protected routes
router.post("/", protect, upload.single("image"), createCategory);
router.put("/:id", protect, upload.single("image"), updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;
