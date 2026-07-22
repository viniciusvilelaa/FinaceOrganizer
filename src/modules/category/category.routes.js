import * as categoryController from "./category.controller.js";
import express from "express"
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const categoryRouter = express.Router();
categoryRouter.use(authMiddleware);

//Endpoints
categoryRouter.post("/", asyncHandler(categoryController.createCategory));
categoryRouter.get("/", asyncHandler(categoryController.getAllCategories));
categoryRouter.put("/:id", asyncHandler(categoryController.updateCategory));
categoryRouter.delete("/:id", asyncHandler(categoryController.updateCategory));

export {categoryRouter};