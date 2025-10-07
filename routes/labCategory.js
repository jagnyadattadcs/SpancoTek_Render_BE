const express = require("express");
const router = express.Router();
const {
    getAllLabCategories,
    getLabCategoriesBySubcategory,
    getLabCategory,
    createLabCategory,
    updateLabCategory,
    deleteLabCategory,
} = require("../controllers/labCategoryController");
const protect = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllLabCategories);
router.get("/subcategory/:subcategoryId", getLabCategoriesBySubcategory);
router.get("/:id", getLabCategory);

// Protected routes
router.post("/", protect, createLabCategory);
router.put("/:id", protect, updateLabCategory);
router.delete("/:id", protect, deleteLabCategory);

module.exports = router;
