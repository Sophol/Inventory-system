"use server";
import { FilterQuery } from "mongoose";

import { Category, Product } from "@/database";
import { ICategoryDoc } from "@/database/category.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateCategorySchema,
  EditCategorySchema,
  GetCategorySchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function createCategory(
  params: CreateCategoryParams
): Promise<ActionResponse<ICategoryDoc>> {
  const validatedData = await action({
    params,
    schema: CreateCategorySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  try {
    const category = await Category.create(validatedData.params);
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function editCategory(
  params: EditCategoryParams
): Promise<ActionResponse<ICategoryDoc>> {
  const validatedData = await action({
    params,
    schema: EditCategorySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { title, status, categoryId } = validatedData.params!;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    if (category.title !== title || category.status !== status) {
      category.title = title;
      category.status = status;
      await category.save();
    }
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getCategory(
  params: GetCategoryParams
): Promise<ActionResponse<Category>> {
  const validatedData = await action({
    params,
    schema: GetCategorySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { categoryId } = validatedData.params!;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getCategories(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    categories: Category[];
    totalCount: number;
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Category> = {};
  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "title":
      sortCriteria = { title: -1 };
      break;
    case "status":
      sortCriteria = { status: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalCategories, categories] = await Promise.all([
      Category.countDocuments(filterQuery),
      Category.find(filterQuery)
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const isNext = totalCategories > skip + categories.length;

    return {
      success: true,
      data: {
        categories: JSON.parse(JSON.stringify(categories)),
        totalCount: totalCategories,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteCategory(
  params: GetCategoryParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetCategorySchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { categoryId } = validatedData.params!;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    const product = await Product.findOne({ category: categoryId });
    if (product) {
      throw new Error("Category បានប្រើរួចហើយ");
    }
    await Category.deleteOne({ _id: category._id });
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
