import * as userController from "./user.controller.js"
import express from "express"
import { asyncHandler } from "../../utils/async-handler.js";

const userRouter = express.Router();

userRouter.get("/", asyncHandler(userController.getUsers));

userRouter.post("/", asyncHandler(userController.createUser));

userRouter.post("/login", asyncHandler(userController.loginUser));


export {userRouter}