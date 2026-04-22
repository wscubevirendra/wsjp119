const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minLength: 2
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        minLength: 2
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
    },
    categoryId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: []
        }
    ]
},
    {
        timestamps: true
    }
)


const brandModel = mongoose.model("Brand", brandSchema);
module.exports = brandModel;