const { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendConflict, sendServerError } = require("../utilts/response");
const CategoryModel = require("../models/category.model");
const { createUniqueName } = require("../utilts/helper");
const create = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const image = req.files.image;
        if (!name || !slug || !image) return sendBadRequest(res)
        const category = await CategoryModel.findOne({ slug });
        if (category) return sendConflict(res);
        const img_name = createUniqueName(image.name)
        const destination = `./public/category/${img_name}`
        image.mv(destination, async (err) => {
            if (err) return sendServerError(res, "Unable to upload file")
            await CategoryModel.create({ name, slug, image: img_name });
            return sendCreated(res)

        })


    } catch (error) {
        return sendServerError(res, error);
    }
}

const read = async (req, res) => {
    try {
        const query = req.query;
        console.log(query)
        const filter = {};
        const limit = query.limit ? parseInt(query.limit) : 0;
        if (query.status) filter.status = query.status === "true";
        if (query.is_home) filter.is_home = query.is_home === "true";
        if (query.is_top) filter.is_top = query.is_top === "true";
        if (query.is_best) filter.is_best = query.is_best === "true";
        if (query.id) filter._id = query.id;

        const category = await CategoryModel.find(filter).limit(limit)
        const total = await CategoryModel.find().countDocuments();
        return sendSuccess(res, "category found", category, {
            total,
            imageBaseUrl: "http://localhost:5000/category/"
        })
    } catch (error) {
        return sendServerError(res);
    }
};

const readById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CategoryModel.findById(id);
        return sendSuccess(res, "category found", category, {
            imageBaseUrl: "http://localhost:5000/category/"
        })
    } catch (error) {
        return sendServerError(res);
    }
};


const statusUpdate = async (req, res) => {
    try {
        const { field } = req.body;
        const id = req.params.id;
        const category = await CategoryModel.findById(id);
        if (!category) return sendNotFound(res);
        const msg = `${field} Updated successfully`
        await CategoryModel.findByIdAndUpdate(id, {
            $set: {
                [field]: !category[field]
            }
        });

        return sendSuccess(res, msg);

    } catch (error) {
        console.log(error)
        return sendServerError(res);
    }

}

const deleteById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CategoryModel.findById(id);
        if (!category) return notFound_Response(res);
        await CategoryModel.findByIdAndDelete({ _id: id });
        return sendSuccess(res, "Delete successfully");
    } catch (error) {

        return sendServerError(res);
    }
}

const update = async (req, res) => {
    try {
        const image = req.files?.image || null;
        const id = req.params.id;

        const category = await CategoryModel.findById(id);
        if (!category) return sendNotFound(res);

        const object = {};

        // name & slug update
        if (req.body.name) {
            object.name = req.body.name;
            object.slug = req.body.slug;
        }

        // image update
        if (image) {
            const img = createUniqueName(image.name);
            const destination = "./public/category/" + img;

            await image.mv(destination); // 🔥 wait till upload
            object.image = img;
        }

        await CategoryModel.updateOne(
            { _id: id },
            { $set: object }
        );

        return sendSuccess(res, "Category updated successfully");

    } catch (error) {
        console.log(error);
        return sendServerError(res);
    }
};




module.exports = {
    create, read, update, statusUpdate, deleteById, readById
}