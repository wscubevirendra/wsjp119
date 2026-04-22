const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minLength: 5
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        minLength: 5
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    is_home: {
        type: Boolean,
        default: false
    },
    is_top: {
        type: Boolean,
        default: false
    },
    is_best: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)


const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;