const LabCategory = require("../models/LabCategory");
const Subcategory = require("../models/Subcategory");

// Get all lab categories
exports.getAllLabCategories = async (req, res) => {
  try {
    const labCategories = await LabCategory.find()
      .populate("parentSubcategory", "name")
      .sort({ createdAt: -1 });
    res.json(labCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get lab categories by subcategory
exports.getLabCategoriesBySubcategory = async (req, res) => {
  try {
    const labCategories = await LabCategory.find({
      parentSubcategory: req.params.subcategoryId,
    })
      .populate("parentSubcategory", "name")
      .sort({ name: 1 });
    res.json(labCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single lab category
exports.getLabCategory = async (req, res) => {
  try {
    const labCategory = await LabCategory.findById(req.params.id).populate(
      "parentSubcategory",
      "name"
    );

    if (!labCategory) {
      return res.status(404).json({ message: "Lab category not found" });
    }
    res.json(labCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create lab category (protected)
exports.createLabCategory = async (req, res) => {
  try {
    const { name, parentSubcategory } = req.body;

    // Check if subcategory exists
    const subcategoryExists = await Subcategory.findById(parentSubcategory);
    if (!subcategoryExists) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Check if lab category already exists in this subcategory
    const existingLabCategory = await LabCategory.findOne({
      name,
      parentSubcategory,
    });
    if (existingLabCategory) {
      return res.status(400).json({
        message: "Lab category already exists in this subcategory",
      });
    }

    const labCategory = new LabCategory({
      name,
      parentSubcategory,
    });

    const savedLabCategory = await labCategory.save();
    await savedLabCategory.populate("parentSubcategory", "name");

    res.status(201).json(savedLabCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update lab category (protected)
exports.updateLabCategory = async (req, res) => {
  try {
    const { name, parentSubcategory } = req.body;
    const labCategory = await LabCategory.findById(req.params.id);

    if (!labCategory) {
      return res.status(404).json({ message: "Lab category not found" });
    }

    // If parentSubcategory is being changed, check if it exists
    if (
      parentSubcategory &&
      parentSubcategory !== labCategory.parentSubcategory.toString()
    ) {
      const subcategoryExists = await Subcategory.findById(parentSubcategory);
      if (!subcategoryExists) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      labCategory.parentSubcategory = parentSubcategory;
    }

    // If name is being changed, check if it already exists in the subcategory
    if (name && name !== labCategory.name) {
      const existingLabCategory = await LabCategory.findOne({
        name,
        parentSubcategory: labCategory.parentSubcategory,
      });
      if (existingLabCategory) {
        return res.status(400).json({
          message: "Lab category name already exists in this subcategory",
        });
      }
      labCategory.name = name;
    }

    const updatedLabCategory = await labCategory.save();
    await updatedLabCategory.populate("parentSubcategory", "name");

    res.json(updatedLabCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete lab category (protected)
exports.deleteLabCategory = async (req, res) => {
  try {
    const labCategory = await LabCategory.findById(req.params.id);

    if (!labCategory) {
      return res.status(404).json({ message: "Lab category not found" });
    }

    // Check if lab category has products (you'll add this later)
    // const productsCount = await Product.countDocuments({ labCategory: req.params.id });
    // if (productsCount > 0) {
    //   return res.status(400).json({
    //     message: 'Cannot delete lab category with existing products'
    //   });
    // }

    await LabCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Lab category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
