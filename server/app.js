require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
let cookieParser = require('cookie-parser')
const server = express();
server.use(express.json());
server.use(cors({
    origin: "http://localhost:3000", // exact frontend URL
    credentials: true
}));  //delete
server.use(cookieParser());
server.use(express.static("./public"))
server.use("/api/category", require("./routers/category.router"));
server.use("/api/brand", require("./routers/brand.router"));
server.use("/api/color", require("./routers/color.router"));
server.use("/api/product", require("./routers/product.router"));
server.use("/api/user", require("./routers/user.router"));
server.use("/api/cart", require("./routers/cart.router"));
server.use("/api/order", require("./routers/order.router"));

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database connected successfully");

        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
    });