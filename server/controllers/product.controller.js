const { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendConflict, sendServerError } = require("../utilts/response");
const ProductModel = require("../models/product.model");
const { createUniqueName } = require("../utilts/helper");
const fs = require("fs");
const CategoryModel = require("../models/category.model");
const BrandModel = require("../models/brand.model");
const ColorModel = require("../models/color.model");
const create = async (req, res) => {
    try {
        console.log(req.body);
        const { name, slug, original_price, final_price, discount_percentage, category_id, brand_id, color_ids, short_description, long_description } = req.body;
        const thumbnail = req.files.thumbnail;
        console.log("thumbnail", thumbnail);
        // if (!name || !slug || !thumbnail || !original_price || !final_price || !discount_percentage || !short_description || !long_description) {
        //     return sendBadRequest(res)
        // }
        const product = await ProductModel.findOne({ slug });
        if (product) return sendConflict(res);
        const image_name = createUniqueName(thumbnail.name)
        const destination = `./public/product/${image_name}`
        thumbnail.mv(destination, async (err) => {
            if (err) return sendServerError(res, "Unable to upload file");
            await ProductModel.create({
                name, slug, original_price, final_price, discount_percentage, category_id, brand_id, color_ids: JSON.parse(color_ids), short_description, long_description, thumbnail: image_name
            });
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
        const sortFilter = {};
        const limit = parseInt(query.limit) || 10;
        const page = query.page || 1
        const skip = parseInt((page - 1) * limit)
        if (query.status) filter.status = query.status === "true";
        if (query.stock) filter.stock = query.stock === "true";
        if (query.id) filter._id = query.id;
        if (query.category_slug) {
            const category = await CategoryModel.findOne({ slug: query.category_slug });
            filter.category_id = category._id
        }
        if (query.brand_slug) {
            const brand = await BrandModel.findOne({ slug: query.brand_slug });
            filter.brand_id = brand._id
        }
        //Color Filter
        if (query.color_slug) {
            // Handle color slug filtering
            const color_slugs = query.color_slug.split(","); // Assuming multiple color slugs can be provided, separated by commas
            const color_ids = [];
            for (let slug of color_slugs) {
                const color = await ColorModel.findOne({ slug: slug.trim() });
                if (color) {
                    color_ids.push(color._id);
                }
            }

            filter.color_ids = { $in: color_ids };
        }

        if (query.min_price && query.max_price) {
            filter.final_price = {
                $gte: parseInt(query.min_price),
                $lte: parseInt(query.max_price)
            };
        }


        if (query.sort) {
            if (query.sort === "asc") {
                sortFilter.final_price = 1;
            } else if (query.sort === "desc") {
                sortFilter.final_price = -1;
            } else {
                sortFilter.createdAt = -1;
            }
        }


        const [total, product] = await Promise.all([
            ProductModel.find().countDocuments(),
            ProductModel.find(filter).skip(skip).limit(limit).sort(sortFilter).populate([
                {
                    select: "name _id slug",
                    path: "category_id"
                },
                {
                    select: "name _id slug",
                    path: "brand_id"

                },
                {
                    select: "name _id color_code slug",
                    path: "color_ids"
                }

            ])

        ])

        return sendSuccess(res, "product found", product, {
            total,
            limit,
            pages: Math.ceil(total / limit),
            imageBaseUrl: "http://localhost:5000/product/"
        })
    } catch (error) {
        console.log(error)
        return sendServerError(res);
    }
};

const add_images = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) return sendNotFound(res);
        if (!req.files || !req.files.images) return sendBadRequest(res, "No files were uploaded.");
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        const image_names = [];
        for (let image of images) {
            const image_name = createUniqueName(image.name);
            const destination = `./public/product/${image_name}`;
            await image.mv(destination);
            image_names.push(image_name);
        }
        product.images.push(...image_names);
        await product.save();
        return sendSuccess(res, "Images added successfully", product)

    } catch (error) {
        return sendServerError(res);
    }
}

const delete_image = async (req, res) => {
    try {
        const { id } = req.params;
        const { image_name } = req.body;
        const product = await ProductModel.findById(id);
        if (!product) return sendNotFound(res);
        await ProductModel.findByIdAndUpdate(id, { $pull: { images: image_name } });
        fs.unlink(`./public/product/${image_name}`, (err) => {
            if (err) console.log("Unable to delete file", err);
            return sendSuccess(res, "Image deleted successfully")
        })

        //["img1.jpg", "img2.jpg", "img3.jpg"] => ["img1.jpg", "img3.jpg"]

    } catch (error) {
        console.log(error)
        return sendServerError(res);
    }
}

const readById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await ProductModel.findById(id).populate([
            {
                select: "name _id",
                path: "category_id"
            },
            {
                select: "name _id",
                path: "brand_id"

            },
            {
                select: "name _id color_code",
                path: "color_ids"
            }

        ])
        return sendSuccess(res, "product found", product, {
            imageBaseUrl: "http://localhost:5000/product/"
        })
    } catch (error) {
        return sendServerError(res);
    }
};

module.exports = {
    create,
    read,
    add_images,
    delete_image,
    readById,

}