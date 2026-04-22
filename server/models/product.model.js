const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxLength: 50,
            unique: true,
            required: true
        },
        slug: {
            type: String,
            maxLength: 60,
            unique: true,
            required: true
        },
        short_description: {
            type: String,
            maxLength: 200,

        },
        long_description: {
            type: String,
        },
        original_price: {
            type: Number,
            required: true
        },
        discount_percentage: {
            type: Number,
            default: 5
        },
        final_price: {
            type: Number,
        },
        category_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Category"
        },
        brand_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand"
        },
        color_ids: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Color"
            }
        ],
        thumbnail: {
            type: String,
            default: null
        },
        images: [
            {
                type: String,
            }
        ],
        stock: {
            type: Boolean,
            default: true
        },
        topSelling: {
            type: Boolean,
            default: false
        },
        status: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;