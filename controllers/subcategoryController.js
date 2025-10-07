const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const LabCategory = require("../models/LabCategory");

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find()
            .populate("parentCategories", "name")
            .sort({ createdAt: -1 });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get subcategories by category
exports.getSubcategoriesByCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.find({
            parentCategories: req.params.categoryId,
        })
            .populate("parentCategories", "name")
            .sort({ name: 1 });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single subcategory
exports.getSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate(
            "parentCategories",
            "name image"
        );

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create subcategory (protected)
exports.createSubcategory = async (req, res) => {
    try {
        const { name, parentCategories, hasLabCategories } = req.body;

        // Check if category exists
        const categoryExists = await Category.findById(parentCategories);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if subcategory already exists in this category
        const existingSubcategory = await Subcategory.findOne({
            name,
            parentCategories,
        });
        if (existingSubcategory) {
            return res.status(400).json({ message: "Subcategory already exists in this category" });
        }

        const subcategory = new Subcategory({
            name,
            parentCategories,
            hasLabCategories: hasLabCategories || false,
        });

        const savedSubcategory = await subcategory.save();
        await savedSubcategory.populate("parentCategories", "name");

        res.status(201).json(savedSubcategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update subcategory (protected)
exports.updateSubcategory = async (req, res) => {
    try {
        const { name, parentCategories, hasLabCategories } = req.body;
        const subcategory = await Subcategory.findById(req.params.id);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // If parentCategories is being changed, check if it exists
        if (
            parentCategories &&
            parentCategories.toString() !== subcategory.parentCategories.toString()
        ) {
            const categoryExists = await Category.findById(parentCategories);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
            subcategory.parentCategories = parentCategories;
        }

        // If name is being changed, check uniqueness within that parent category
        if (name && name !== subcategory.name) {
            const existingSubcategory = await Subcategory.findOne({
                name,
                parentCategories: subcategory.parentCategories,
            });
            if (existingSubcategory) {
                return res.status(400).json({
                    message: "Subcategory name already exists in this category",
                });
            }
            subcategory.name = name;
        }

        // Update hasLabCategories if provided
        if (typeof hasLabCategories !== "undefined") {
            subcategory.hasLabCategories = hasLabCategories;
        }

        const updatedSubcategory = await subcategory.save();
        await updatedSubcategory.populate("parentCategories", "name");

        res.json(updatedSubcategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete subcategory (protected)
exports.deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // Check if subcategory has lab categories
        const labCategoriesCount = await LabCategory.countDocuments({
            parentSubcategory: req.params.id,
        });
        if (labCategoriesCount > 0) {
            return res.status(400).json({
                message: "Cannot delete subcategory with existing lab categories",
            });
        }

        await Subcategory.findByIdAndDelete(req.params.id);
        res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
