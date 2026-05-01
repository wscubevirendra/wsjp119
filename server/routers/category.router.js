const categoryRouter = require("express").Router();
const fileUploader = require("express-fileupload")
const { create, read, update, statusUpdate, deleteById, readById } = require("../controllers/category.controller");
const { protect, authorized } = require("../middleware/auth")
categoryRouter.post("/create", protect, authorized("admin", "superAdmin"), fileUploader({ createParentPath: true }), create);
categoryRouter.get("/", read);
categoryRouter.get("/:id", readById);
categoryRouter.patch("/status-update/:id", protect, authorized("admin", "superAdmin"), statusUpdate);
categoryRouter.delete("/delete/:id", protect, authorized("admin", "superAdmin"), deleteById);
categoryRouter.put("/update/:id", protect, authorized("admin", "superAdmin"), fileUploader({ createParentPath: true }), update)

module.exports = categoryRouter;