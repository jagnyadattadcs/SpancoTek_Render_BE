const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "spanco/categories",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});
// In config/cloudinary.js, add this:
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spanco/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  },
});

const uploadProductImages = multer({ storage: productStorage });



const upload = multer({ storage: storage });

module.exports = {
    cloudinary,
    upload, // for categories
    uploadProductImages, // for products
};
