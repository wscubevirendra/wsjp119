const mongoose = require("mongoose");


const colorSchema = new mongoose.Schema({
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
    color_code: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    },

},
    {
        timestamps: true
    }
)


const colorModel = mongoose.model("Color", colorSchema);
module.exports = colorModel;