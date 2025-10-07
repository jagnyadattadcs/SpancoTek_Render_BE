const mongoose = require("mongoose");

const technicalSpecSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    value: {
        type: String,
        required: true,
        trim: true,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        PCode: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            uppercase: true,
        },
        image: [
            {
                type: String,
            },
        ],
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
        },
        labCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LabCategory",
        },
        technicalSpecification: [technicalSpecSchema],
    },
    {
        timestamps: true,
    }
);

// Index for better search performance
productSchema.index({ name: "text", description: "text", PCode: "text" });
productSchema.index({ categories: 1 });
productSchema.index({ subCategory: 1 }); // Changed from subcategory to subCategory
productSchema.index({ labCategory: 1 }); // Changed from labcategory to labCategory

module.exports = mongoose.model("Product", productSchema);
