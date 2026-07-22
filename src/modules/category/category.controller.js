import * as categoryService from "./category.service.js";
import { createCategorySchema, updateCategorySchema } from "./category.schema.js";


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

//Endpoint updateCategory
export const updateCategory = async (req, res, next) => {
    
    try{
        const userId = req.user.sub;
        const categoryId = Number(req.params.id);
        const bodyParsed = updateCategorySchema.safeParse(req.body);

        if (!bodyParsed.success) {
            return res.status(400).json({
            message: 'Invalid inputs for updating a category',
            error: bodyParsed.error.flatten().fieldErrors,
            });
        }
        
        const updatedCategory = await categoryService.updateCategory(userId, categoryId, bodyParsed.data);

        return res.status(200).json(updatedCategory)
    } catch (err) {
      next(err);
    }

}

//Endpoint deleteCategory
export const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const categoryId = Number(req.params.id);

    const deletedCategory = await categoryService.deleteCategoryById(userId, categoryId);

    return res.status(200).json(deletedCategory);

  } catch (err) {
    next(err);
  }
}; 

//Endpoint GET all categories (system + user)
export const getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    const categories = await categoryService.getAllCategoriesForUser(userId);

    return res.status(200).json(categories);

  } catch (err) {
    next(err);
  }
};