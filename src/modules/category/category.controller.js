import * as categoryService from "./category.service.js";
import { createCategorySchema, updateCategorySchema } from "./category.schema";


//Endpoint POST Category
export const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const bodyParsed = createCategorySchema.safeParse(req.body);

    if (!bodyParsed.success) {
      return res.status(400).json({
        message: 'Invalid inputs for create a category',
        error: bodyParsed.error.flatten().fieldErrors,
      });
    }

    const category = await categoryService.createCategory(userId, bodyParsed.data);

    return res.status(201).json(category);

  } catch (err) {
    next(err);
  }
};