import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { Product } from "@/database";
import { ProductSearchParamsSchema } from "../validations";
import { ObjectId } from "mongodb";

export async function getProductReports(
  params: ProductSearchParams
): Promise<
  ActionResponse<{ products: Product[]; totalCount: number; isNext: boolean }>
> {
  const validatedData = await action({
    params,
    schema: ProductSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
    categoryId,
    branchId,
  } = validatedData.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Product> = {};

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { code: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }

  if (categoryId) {
    filterQuery.category = new ObjectId(categoryId);
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
    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(filterQuery),
      Product.aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: "productunits",
            localField: "_id",
            foreignField: "product",
            as: "units",
          },
        },
        { $unwind: { path: "$units", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "units",
            localField: "units.unit",
            foreignField: "_id",
            as: "unitDetails",
          },
        },
        { $unwind: { path: "$unitDetails", preserveNullAndEmptyArrays: true } },
        { $addFields: { "units.unit": "$unitDetails._id" } },
        { $addFields: { "units.unitTitle": "$unitDetails.title" } },
        {
          $sort: { "units.level": 1 }, // Sort units by level in ascending order
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stocks",
            localField: "_id",
            foreignField: "product",
            as: "stockDetails",
          },
        },
        {
          $addFields: {
            qtySmallUnit: { $sum: "$stockDetails.qtySmallUnit" },
          },
        },
        ...(branchId
          ? [
              {
                $match: {
                  "stockDetails.branch": new ObjectId(branchId),
                },
              },
            ]
          : []),
        {
          $group: {
            _id: "$_id",
            code: { $first: "$code" },
            title: { $first: "$title" },
            description: { $first: "$description" },
            image: { $first: "$image" },
            category: { $first: "$categoryDetails._id" },
            categoryTitle: { $first: "$categoryDetails.title" },
            qtyOnHand: { $first: "$qtyOnHand" },
            alertQty: { $first: "$alertQty" },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            units: { $push: "$units" },
            qtySmallUnit: { $first: "$qtySmallUnit" },
          },
        },
        { $sort: sortCriteria },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);

    const isNext = totalProducts > skip + products.length;
    return {
      success: true,
      data: {
        products: JSON.parse(JSON.stringify(products)),
        totalCount: totalProducts,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getAlertQtyReports(
  params: ProductSearchParams
): Promise<
  ActionResponse<{ products: Product[]; totalCount: number; isNext: boolean }>
> {
  const validatedData = await action({
    params,
    schema: ProductSearchParamsSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
    categoryId,
    branchId,
  } = validatedData.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Product> = {};

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { code: { $regex: new RegExp(query, "i") } },
      { status: { $regex: new RegExp(query, "i") } },
    ];
  }

  if (categoryId) {
    filterQuery.category = new ObjectId(categoryId);
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
    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(filterQuery),
      Product.aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: "productunits",
            localField: "_id",
            foreignField: "product",
            as: "units",
          },
        },
        { $unwind: { path: "$units", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "units",
            localField: "units.unit",
            foreignField: "_id",
            as: "unitDetails",
          },
        },
        { $unwind: { path: "$unitDetails", preserveNullAndEmptyArrays: true } },
        { $addFields: { "units.unit": "$unitDetails._id" } },
        { $addFields: { "units.unitTitle": "$unitDetails.title" } },
        {
          $sort: { "units.level": 1 }, // Sort units by level in ascending order
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stocks",
            localField: "_id",
            foreignField: "product",
            as: "stockDetails",
          },
        },
        {
          $addFields: {
            qtySmallUnit: { $sum: "$stockDetails.qtySmallUnit" },
          },
        },
        ...(branchId
          ? [
              {
                $match: {
                  "stockDetails.branch": new ObjectId(branchId),
                },
              },
            ]
          : []),
        {
          $group: {
            _id: "$_id",
            code: { $first: "$code" },
            title: { $first: "$title" },
            description: { $first: "$description" },
            image: { $first: "$image" },
            category: { $first: "$categoryDetails._id" },
            categoryTitle: { $first: "$categoryDetails.title" },
            qtyOnHand: { $first: "$qtyOnHand" },
            alertQty: { $first: "$alertQty" },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            units: { $push: "$units" },
            qtySmallUnit: { $first: "$qtySmallUnit" },
          },
        },
        {
          $match: {
            $expr: { $lte: ["$qtySmallUnit", "$alertQty"] },
          },
        },
        { $sort: sortCriteria },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);
    const isNext = totalProducts > skip + products.length;
    return {
      success: true,
      data: {
        products: JSON.parse(JSON.stringify(products)),
        totalCount: totalProducts,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
