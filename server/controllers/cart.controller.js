const { sendServerError } = require("../utilts/response")
const CartModel = require("../models/cart.model");

const syncCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const localCart = JSON.parse(req.body.localCart) || [];

        if (localCart.length === 0) {
            const userCart = await CartModel.findOne({ userId }).populate({
                path: "items.productId",
                select: "name _id original_price final_price discount_percentage price thumbnail"
            });

            return res.status(200).json({
                message: "Fetched cart from server",
                success: true,
                cart: userCart ? userCart.items : [],
                imageBaseUrl: "http://localhost:5000/category/"
            });
        }

        let userCart = await CartModel.findOne({ userId })
            .populate({
                path: "items.productId",
                select: "name _id original_price final_price discount_percentage price thumbnail stock"
            });


        // If no cart → create new
        if (!userCart) {
            userCart = new CartModel({
                userId,
                items: []
            });
        }

        // Merge local cart into DB cart
        localCart.forEach((cartItem) => {
            const { id, qty } = cartItem;
            const existingItem = userCart.items.find(
                (item) => {
                    return item.productId._id == id
                }
            );

            if (existingItem) {
                existingItem.qty += qty;
            } else {
                userCart.items.push({
                    productId: id,
                    qty
                });
            }
        });

        await userCart.save();

        res.status(200).json({
            message: "Cart synced successfully",
            success: true,
            cart: userCart,
            imageBaseUrl: "http://localhost:5000/category/"

        });

    } catch (error) {
        console.log(error);
        return sendServerError(res);
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id, qty } = req.body

        let userCart = await CartModel.findOne({ userId })
            .populate({
                path: "items.productId",
                select: "name _id original_price final_price discount_percentage price thumbnail stock"
            });


        const existingItem = userCart.items.find(
            (item) => {
                return item.productId._id == id
            }
        );

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            userCart.items.push({
                productId: id,
                qty
            });
        }
        await userCart.save();

        res.status(200).json({
            message: "Cart synced successfully",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return sendServerError(res);
    }
};
const read = async (req, res) => {
    try {
        res.send("Hello")

    } catch (error) {
        return sendServerError(res);
    }
};
module.exports = {
    syncCart, read
}