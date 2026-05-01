const userRouter = require("express").Router();
const { register, verifyEmail, resetOtp, login, getMe,address,logout, getAddresses, addAddress } = require("../controllers/user.controller.js");
const { protect } = require("../middleware/auth.js");
userRouter.post("/register", register);
userRouter.post("/verify-otp", verifyEmail);
userRouter.post("/reset-otp", resetOtp);
userRouter.post("/login", login);
userRouter.get("/get", protect, getMe);
userRouter.get("/logout", logout);
userRouter.post("/addAddress",protect, addAddress);

module.exports = userRouter;