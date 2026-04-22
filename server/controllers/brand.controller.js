const { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendConflict, sendServerError } = require("../utilts/response");
const BrandModel = require("../models/brand.model");
const { createUniqueName } = require("../utilts/helper");
const create = async (req, res) => {
    try {
        const { name, slug, categoryId } = req.body;
        const image = req.files.image;
        if (!name || !slug || !image || !categoryId) return sendBadRequest(res)
        const brand = await BrandModel.findOne({ slug });
        if (brand) return sendConflict(res);
        const img_name = createUniqueName(image.name)
        const destination = `./public/brand/${img_name}`
        image.mv(destination, async (err) => {
            if (err) return sendServerError(res, "Unable to upload file")
            await BrandModel.create({ name, slug, image: img_name, categoryId: JSON.parse(categoryId) });
            return sendCreated(res)

        })


    } catch (error) {
        return sendServerError(res, error);
    }
}


const read = async (req, res) => {
    try {
        const query = req.query;
        const filter = {};
        if (query.status) filter.status = query.status === "true";
        if (query.is_home) filter.is_home = query.is_home === "true";
        if (query.is_top) filter.is_top = query.is_top === "true";
        if (query.is_best) filter.is_best = query.is_best === "true";
        if (query.id) filter._id = query.id;
        const brand = await BrandModel.find(filter).populate("categoryId")
        const total = await BrandModel.find().countDocuments();
        return sendSuccess(res, "brand found", brand, {
            total,
            imageBaseUrl: "http://localhost:5000/brand/"
        })
    } catch (error) {
        return sendServerError(res);
    }
};

module.exports = {
    create, read
}