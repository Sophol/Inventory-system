"use server";
import mongoose, { FilterQuery } from "mongoose";

import ProductUnit from "@/database/product-unit.model";
import Product, { IProductDoc } from "@/database/product.model";
import Unit from "@/database/unit.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { updateLevels } from "../utils";
import {
  CreateProductSchema,
  EditProductSchema,
  GetProductSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
const ObjectId = mongoose.Types.ObjectId;
export async function createProduct(
  params: CreateProductParams
): Promise<ActionResponse<IProductDoc>> {
  const validatedData = await action({
    params,
    schema: CreateProductSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    code,
    title,
    description,
    units,
    image,
    category,
    qtyOnHand,
    alertQty,
    status,
  } = validatedData.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [product] = await Product.create(
      [
        {
          code,
          title,
          description,
          image,
          category: new ObjectId(category),
          qtyOnHand,
          alertQty,
          status,
        },
      ],
      { session }
    );

    if (!product) {
      throw new Error("Failed to create product");
    }
    const unitIds: mongoose.Types.ObjectId[] = [];
    const productUnitDocuments: ProductUnit[] = [];
    for (const unit of units) {
      const existingUnit = await Unit.findById(unit.unit);
      if (!existingUnit) {
        throw new Error("No Unit Found");
      }
      unitIds.push(existingUnit._id);

      productUnitDocuments.push({ ...unit, product: product._id });
    }
    const newProductUnitDocs = updateLevels(productUnitDocuments);
    await ProductUnit.insertMany(newProductUnitDocs, { session });
    await Product.findByIdAndUpdate(
      product._id,
      { $push: { units: { $each: unitIds } } },
      { session }
    );
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function editProduct(
  params: EditProductParams
): Promise<ActionResponse<Product>> {
  const validatedData = await action({
    params,
    schema: EditProductSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    productId,
    code,
    title,
    description,
    image,
    units,
    category,
    qtyOnHand,
    alertQty,
    status,
  } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(productId).populate("units");
    if (!product) {
      throw new Error("Product not found");
    }
    if (code) product.code = code;
    if (title) product.title = title;
    if (description) product.description = description;
    if (image) product.image = image;
    if (category) product.category = category;
    if (qtyOnHand !== undefined) product.qtyOnHand = qtyOnHand;
    if (alertQty !== undefined) product.alertQty = alertQty;
    if (status) product.status = status;
    await product.save({ session });
    if (units) {
      const newUnitDocuments = [];
      for (const unit of units) {
        const existingUnit = await ProductUnit.findOne({
          product: productId,
          unit: unit.unit,
        }).session(session);
        if (existingUnit) {
          if (unit.qty !== undefined) existingUnit.qty = unit.qty;
          if (unit.cost !== undefined) existingUnit.cost = unit.cost;
          if (unit.price !== undefined) existingUnit.price = unit.price;
          if (unit.wholeSalePrice !== undefined)
            existingUnit.wholeSalePrice = unit.wholeSalePrice;
          if (unit.level !== undefined) existingUnit.level = unit.level;

          await existingUnit.save({ session });
        } else {
          newUnitDocuments.push({ ...unit, product: productId });

          product.units.push(unit.unit);
        }
      }
      const unitsToRemove = product.units.filter(
        (unit: Unit) =>
          !units.some((u) => u.unit.toString() === unit._id.toString())
      );
      if (unitsToRemove.length > 0) {
        const unitIdsToRemove = unitsToRemove.map((unit: Unit) => unit._id);
        await ProductUnit.deleteMany(
          { unit: { $in: unitIdsToRemove } },
          { session }
        );
        product.units = product.units.filter(
          (unit: Unit) =>
            !unitIdsToRemove.some(
              (u: Unit) => u._id.toString() === unit._id.toString()
            )
        );
      }
      if (newUnitDocuments.length > 0) {
        await ProductUnit.insertMany(newUnitDocuments, { session });
      }
      const allUnits = await ProductUnit.find({ product: productId }).session(
        session
      );
      const updatedUnits = updateLevels(allUnits);
      const bulkOps = updatedUnits.map((unit) => ({
        updateOne: {
          filter: { product: unit.product, unit: unit.unit },
          update: { $set: { level: unit.level } },
        },
      }));
      await ProductUnit.bulkWrite(bulkOps, { session });
      await product.save({ session });
    }
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function getProduct(
  params: GetProductParams
): Promise<ActionResponse<Product>> {
  const validatedData = await action({
    params,
    schema: GetProductSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { productId } = validatedData.params!;
  try {
    const product = await Product.aggregate([
      { $match: { _id: new ObjectId(productId) } },
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
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },
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
        },
      },
    ]);
    if (product.length === 0) {
      throw new Error("Product not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(product[0])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getProducts(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ products: Product[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Product> = {};
  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { code: { $regex: new RegExp(query, "i") } },
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
    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(filterQuery),
      Product.find(filterQuery)
        .populate("category", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit), // Populate the units field
    ]);

    const isNext = totalProducts > skip + products.length;
    return {
      success: true,
      data: { products: JSON.parse(JSON.stringify(products)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
