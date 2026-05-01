const cartRouter = require("express").Router();
const { syncCart, read } = require("../controllers/cart.controller.js");
const { protect } = require("../middleware/auth");
cartRouter.post("/sync", protect, syncCart);
cartRouter.get("/", read);
module.exports = cartRouter;