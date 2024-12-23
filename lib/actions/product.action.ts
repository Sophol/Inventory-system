import ProductUnit, { IProductUnitDoc } from "@/database/product-unit.model";
import Product, { IProductDoc } from "@/database/product.model";
import mongoose, { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateProductSchema,
  EditProductSchema,
  GetProductSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

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
          category,
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

    const productUnitDocuments = units.map((unit) => ({
      ...unit,
      product: product._id,
    }));

    await ProductUnit.insertMany(productUnitDocuments, { session });

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
          //product.units.push(existingUnit.unit);
          await existingUnit.save({ session });
        } else {
          newUnitDocuments.push({ ...unit, product: productId });
          //   await ProductUnit.create([{ ...unit, product: productId }], {
          //     session,
          //   });
          product.units.push(unit.unit);
        }
      }
      const unitsToRemove = product.units.filter(
        (unit: IProductUnitDoc) =>
          !units.some((u) => u.unit.toString() === unit.id.toString())
      );
      if (unitsToRemove.length > 0) {
        const unitIdsToRemove = unitsToRemove.map(
          (unit: IProductUnitDoc) => unit.id
        );
        await ProductUnit.deleteMany(
          { _id: { $in: unitIdsToRemove } },
          { session }
        );
        product.units = product.units.filter(
          (unit: IProductUnitDoc) =>
            !unitIdsToRemove.some(
              (u: IProductUnitDoc) => u.id.toString() === unit.id.toString()
            )
        );
      }
      if (newUnitDocuments.length > 0) {
        await ProductUnit.insertMany(newUnitDocuments, { session });
      }
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
): Promise<ActionResponse<IProductDoc>> {
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
    const product = await Product.findById(productId).populate("units");
    if (!product) {
      throw new Error("Product not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
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
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .populate("units"), // Populate the units field
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
