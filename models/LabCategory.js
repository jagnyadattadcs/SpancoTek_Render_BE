const mongoose = require("mongoose");

const labCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        parentSubcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique lab category names per subcategory
labCategorySchema.index({ name: 1, parentSubcategory: 1 }, { unique: true });

module.exports = mongoose.model("LabCategory", labCategorySchema);
