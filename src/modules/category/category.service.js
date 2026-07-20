import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";

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
    }
  });

  

  return sortCategories(categories);
}