const categoryRouter = require("express").Router();
const fileUploader = require("express-fileupload")
const { create, read, update, statusUpdate, deleteById, readById } = require("../controllers/category.controller");
categoryRouter.post("/create", fileUploader({ createParentPath: true }), create);
categoryRouter.get("/", read);
categoryRouter.get("/:id", readById);
categoryRouter.patch("/status-update/:id", statusUpdate);
categoryRouter.delete("/delete/:id", deleteById);
categoryRouter.put("/update/:id", fileUploader({ createParentPath: true }), update)

module.exports = categoryRouter;