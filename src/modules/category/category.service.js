import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import { notFoundMiddleware } from "../../middlewares/not-found.middleware.js";

function sortCategories(categories) {
  return categories.sort((a, b) => {
    if (a.userId === null && b.userId !== null) return -1;
    if (a.userId !== null && b.userId === null) return 1;
    return a.name.localeCompare(b.name);
  });
}

//Create new category
export async function createCategory(userId, payload) {
  const { name, color } = payload;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId,
      },
    });

    return category;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "You already have a category with this name.");
    }

    console.error("Error creating category:", error);
    throw new ApiError(500, "Error when creating category.");
  }
}

//Update Category
export async function updateCategory(userId, categoryId, payload) {
  await findOwnedCategory(userId, categoryId);

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: payload.name,
        color: payload.color,
      },
    });

    return updatedCategory;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new ApiError(409, "You already have a category with this name.");
    }

    console.error("Error creating category:", err);
    throw new ApiError(500, "Error when updating category.");
  }
}

//Update Category
export async function deleteCategoryById(userId, categoryId) {
  await findOwnedCategory(userId, categoryId);

  const transactionsCount = await prisma.transaction.count({
    where: { categoryId },
  });

  if (transactionsCount > 0) {
    throw new ApiError(409, "Category is in use and cannout be deleted.");
  }

  try {
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    return deletedCategory;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2003"
    ) {
      throw new ApiError(409, "Category is in use and cannot be deleted");
    }

    console.error("Error creating category:", err);
    throw new ApiError(500, "Error when deleting category.");
  }

}

//Get all category, system and user.
export async function getAllCategoriesForUser(userId) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: userId }, // Campo preenchido
        { userId: null }, // Campo nulo
      ],
    },
  });

  return sortCategories(categories);
}

//Find user usable categories
export async function findUsableCategory(userId, categoryId) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.userId === userId || category.userId === null) {
    return category;
  } else {
    throw new ApiError(403, "You don't have acess to this category");
  }
}

//Find a category created by user
export async function findOwnedCategory(userId, categoryId) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.userId === userId) {
    return category;
  } else {
    throw new ApiError(403, "You don't have permission to acess this category");
  }
}
