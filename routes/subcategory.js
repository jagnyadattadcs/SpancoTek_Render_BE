const express = require("express");
const router = express.Router();
const {
    getAllSubcategories,
    getSubcategoriesByCategory,
    getSubcategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
} = require("../controllers/subcategoryController");
const protect = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllSubcategories);
router.get("/category/:categoryId", getSubcategoriesByCategory);
router.get("/:id", getSubcategory);

// Protected routes
router.post("/", protect, createSubcategory);
router.put("/:id", protect, updateSubcategory);
router.delete("/:id", protect, deleteSubcategory);

module.exports = router;
