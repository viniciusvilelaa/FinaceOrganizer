import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { login, register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));

export { authRouter };
