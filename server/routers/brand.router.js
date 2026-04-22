const brandRouter = require("express").Router();
const fileUploader = require("express-fileupload")
const { create, read } = require("../controllers/brand.controller");
brandRouter.post("/create", fileUploader({ createParentPath: true }), create);
brandRouter.get("/", read);
module.exports = brandRouter;