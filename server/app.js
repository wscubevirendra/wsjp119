require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const server = express();
server.use(express.json());
server.use(cors("*"));
server.use(express.static("./public"))
server.use("/api/category", require("./routers/category.router"));
server.use("/api/brand", require("./routers/brand.router"));
server.use("/api/color", require("./routers/color.router"));
server.use("/api/product", require("./routers/product.router"));

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