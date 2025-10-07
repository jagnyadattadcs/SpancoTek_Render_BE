// const express = require("express");
// const router = express.Router();
// const {
//     getProducts,
//     getProductsByCategory,
//     getProductsBySubcategory,
//     getProductsByLabCategory,
//     getProductById,
//     getProductByPCode,
//     createProduct,
//     updateProduct,
//     deleteProduct,
// } = require("../controllers/productController");
// const protect = require("../middleware/authMiddleware");

// // Public routes
// router.get("/", getProducts);
// router.get("/category/:categoryId", getProductsByCategory);
// router.get("/subcategory/:subCategoryId", getProductsBySubcategory);
// router.get("/labcategory/:labCategoryId", getProductsByLabCategory);
// router.get("/id/:id", getProductById);
// router.get("/pcode/:pcode", getProductByPCode);

// // Protected routes
// router.post("/", protect, createProduct);
// router.put("/:id", protect, updateProduct);
// router.delete("/:id", protect, deleteProduct);

// module.exports = router;



const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductsByCategory,
  getProductsBySubcategory,
  getProductsByLabCategory,
  getProductById,
  getProductByPCode,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const { uploadProductImages } = require("../config/cloudinary"); // ⬅️ use product uploader

// Public routes
router.get("/", getProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/subcategory/:subCategoryId", getProductsBySubcategory);
router.get("/labcategory/:labCategoryId", getProductsByLabCategory);
router.get("/id/:id", getProductById);
router.get("/pcode/:pcode", getProductByPCode);

// Protected routes with image upload
router.post("/", protect, uploadProductImages.single("image"), createProduct);
router.put("/:id", protect, uploadProductImages.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
