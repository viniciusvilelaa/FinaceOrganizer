import * as userController from "./user.controller.js"
import express from "express"
import { asyncHandler } from "../../utils/async-handler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const userRouter = express.Router();


userRouter.get("/me", authMiddleware, asyncHandler(userController.getMe));

userRouter.post("/", asyncHandler(userController.createUser));

userRouter.post("/login", asyncHandler(userController.loginUser));


export {userRouter}