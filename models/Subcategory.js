const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        parentCategories: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        // In models/Subcategory.js, add this field to the schema
        hasLabCategories: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique subcategory names per category
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);
