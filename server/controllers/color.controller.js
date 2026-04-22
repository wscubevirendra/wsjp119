const { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendConflict, sendServerError } = require("../utilts/response");
const ColorModel = require("../models/color.model");
const create = async (req, res) => {
    try {
        const { name, slug, color_code } = req.body;
        if (!name || !slug || !color_code) return sendBadRequest(res)
        const color = await ColorModel.findOne({ slug });
        if (color) return sendConflict(res);
        await ColorModel.create({ name, slug, color_code });
        return sendCreated(res)
    } catch (error) {
        return sendServerError(res, error);
    }
}

const read = async (req, res) => {
    try {
        const query = req.query;

        const filter = {};
        const limit = query.limit ? parseInt(query.limit) : 0
        if (query.status) filter.status = query.status === "true";
        if (query.id) filter._id = query.id;
        const color = await ColorModel.find(filter).limit(limit)
        const total = await ColorModel.find().countDocuments();
        return sendSuccess(res, "color found", color, {
            total
        })
    } catch (error) {
        return sendServerError(res);
    }
};

//



module.exports = {
    create, read
}