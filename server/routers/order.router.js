const orderRouter = require("express").Router();
const { createOrder, verifyPayment, getAllOrders, updateOrderStatus } = require("../controllers/order.controller.js");
const { protect, authorized } = require("../middleware/auth.js");
orderRouter.post("/create", protect, createOrder);
orderRouter.post("/verify", protect, verifyPayment);
orderRouter.get("/", protect, authorized("admin", "superAdmin"), getAllOrders);
orderRouter.get("/status", protect, authorized("admin", "superAdmin"), updateOrderStatus);
module.exports = orderRouter;