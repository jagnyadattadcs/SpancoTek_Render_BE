
const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const LabCategory = require("../models/LabCategory");

// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      subCategory,
      labCategory,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { PCode: { $regex: search, $options: "i" } },
        { "technicalSpecification.label": { $regex: search, $options: "i" } },
        { "technicalSpecification.value": { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.categories = category;
    }
    if (subCategory) {
      filter.subCategory = subCategory;
    }
    if (labCategory) {
      filter.labCategory = labCategory;
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("categories", "name")
      .populate("subCategory", "name")
      .populate("labCategory", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { categories: categoryId };

    if (search) {
      filter.$and = [
        { categories: categoryId },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { PCode: { $regex: search, $options: "i" } },
            {
              "technicalSpecification.label": { $regex: search, $options: "i" },
            },
            {
              "technicalSpecification.value": { $regex: search, $options: "i" },
            },
          ],
        },
      ];
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("categories", "name")
      .populate("subCategory", "name")
      .populate("labCategory", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      category: categoryExists.name,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

// Get products by subcategory
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const {
      page = 1,
      limit = 50,
      search = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const subcategoryExists = await Subcategory.findById(
      subCategoryId
    ).populate("parentCategories", "name");
    if (!subcategoryExists) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { subCategory: subCategoryId };

    if (search) {
      filter.$and = [
        { subCategory: subCategoryId },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { PCode: { $regex: search, $options: "i" } },
            {
              "technicalSpecification.label": { $regex: search, $options: "i" },
            },
            {
              "technicalSpecification.value": { $regex: search, $options: "i" },
            },
          ],
        },
      ];
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("categories", "name")
      .populate("subCategory", "name")
      .populate("labCategory", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      subCategory: subcategoryExists.name,
      parentCategories: subcategoryExists.parentCategories,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by subcategory",
      error: error.message,
    });
  }
};

// Get products by lab category
exports.getProductsByLabCategory = async (req, res) => {
  try {
    const { labCategoryId } = req.params;
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const labCategoryExists = await LabCategory.findById(
      labCategoryId
    ).populate("parentSubcategory", "name");
    if (!labCategoryExists) {
      return res.status(404).json({
        success: false,
        message: "Lab Category not found",
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { labCategory: labCategoryId };

    if (search) {
      filter.$and = [
        { labCategory: labCategoryId },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { PCode: { $regex: search, $options: "i" } },
            {
              "technicalSpecification.label": { $regex: search, $options: "i" },
            },
            {
              "technicalSpecification.value": { $regex: search, $options: "i" },
            },
          ],
        },
      ];
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("categories", "name")
      .populate("subCategory", "name")
      .populate("labCategory", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      labCategory: labCategoryExists.name,
      parentSubcategory: labCategoryExists.parentSubcategory,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by lab category",
      error: error.message,
    });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("categories", "name")
      .populate("subCategory", "name")
      .populate("labCategory", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Get product by PCode
exports.getProductByPCode = async (req, res) => {
  try {
    const { pcode } = req.params;

    const product = await Product.findOne({ PCode: pcode.toUpperCase() })
      .populate("categories", "name")
      .populate("subCategory", "name")
      .populate("labCategory", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this PCode",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product by PCode",
      error: error.message,
    });
  }
};

// Create product (protected)
exports.createProduct = async (req, res) => {
  try {
    let {
      name,
      PCode,
      subCategory,
      labCategory,
      description,
      categories,
      technicalSpecification,
    } = req.body;

    // Parse technicalSpecification if it's a string
    technicalSpecification =
      typeof technicalSpecification === "string"
        ? JSON.parse(technicalSpecification)
        : technicalSpecification || [];

    if (!name || !PCode || !subCategory) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: Name, Product Code (PCode), Subcategory",
      });
    }

    const subcategoryExists = await Subcategory.findById(subCategory);
    if (!subcategoryExists) {
      return res.status(404).json({
        success: false,
        message: `Subcategory not found with id ${subCategory}`,
      });
    }

    if (labCategory) {
      const labcategoryExists = await LabCategory.findById(labCategory);
      if (!labcategoryExists) {
        return res.status(404).json({
          success: false,
          message: `Lab Category not found with id ${labCategory}`,
        });
      }
    }

    if (categories && categories.length > 0) {
      const categoriesArray = Array.isArray(categories)
        ? categories
        : [categories];
      for (const catId of categoriesArray) {
        const categoryExists = await Category.findById(catId);
        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: `Category not found with id ${catId}`,
          });
        }
      }
    }

    const product = await Product.create({
      name,
      PCode: PCode.toUpperCase(),
      subCategory,
      labCategory: labCategory || null,
      description: description || "",
      categories: categories || [],
      technicalSpecification: technicalSpecification || [],
      image: req.file ? [req.file.path] : req.body.image || [], // ✅ handle cloudinary
    });

    await product.populate("categories", "name");
    await product.populate("subCategory", "name");
    await product.populate("labCategory", "name");

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this PCode already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Update product (protected)
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      PCode,
      subCategory,
      labCategory,
      description,
      categories,
      technicalSpecification,
    } = req.body;

    if (!name || !PCode || !subCategory) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: Name, Product Code (PCode), Subcategory",
      });
    }

    const subcategoryExists = await Subcategory.findById(subCategory);
    if (!subcategoryExists) {
      return res.status(404).json({
        success: false,
        message: `Subcategory not found with id ${subCategory}`,
      });
    }

    if (labCategory) {
      const labcategoryExists = await LabCategory.findById(labCategory);
      if (!labcategoryExists) {
        return res.status(404).json({
          success: false,
          message: `Lab Category not found with id ${labCategory}`,
        });
      }
    }

    if (categories && categories.length > 0) {
      const categoriesArray = Array.isArray(categories)
        ? categories
        : [categories];
      for (const catId of categoriesArray) {
        const categoryExists = await Category.findById(catId);
        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: `Category not found with id ${catId}`,
          });
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        PCode: PCode.toUpperCase(),
        subCategory,
        labCategory: labCategory || null,
        description: description || "",
        categories: categories || [],
        technicalSpecification: technicalSpecification || [],
        image: req.file ? [req.file.path] : req.body.image || [], // ✅ handle cloudinary
      },
      { new: true, runValidators: true }
    )
      .populate("categories", "name")
      .populate("subCategory", "name")
      .populate("labCategory", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this PCode already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product (protected)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
