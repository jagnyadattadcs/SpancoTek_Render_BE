const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const { cloudinary } = require("../config/cloudinary");

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single category
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create category (protected)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({
            name,
            image: req.file.path,
            imagePublicId: req.file.filename,
        });

        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update category (protected)
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if name is being changed and if it already exists
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: "Category name already exists" });
            }
            category.name = name;
        }

        // If new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(category.imagePublicId);

            category.image = req.file.path;
            category.imagePublicId = req.file.filename;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete category (protected)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if category has subcategories
        const subcategoriesCount = await Subcategory.countDocuments({ category: req.params.id });
        if (subcategoriesCount > 0) {
            return res.status(400).json({
                message: "Cannot delete category with existing subcategories",
            });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(category.imagePublicId);

        // Delete category
        await Category.findByIdAndDelete(req.params.id);

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
