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
  ProductSearchParamsSchema,
} from "../validations";
import { PurchaseDetail, SaleDetail } from "@/database";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";
const ObjectId = mongoose.Types.ObjectId;
export async function createProduct(
  params: CreateProductParams | FormData
): Promise<ActionResponse<IProductDoc>> {
  // Check if params is FormData (from multipart/form-data request)
  let validatedData;
  let files: File[] = [];

  if (params instanceof FormData) {
    // Extract files from FormData
    const filesArray: File[] = [];
    params.getAll("product_images").forEach((file) => {
      if (file instanceof File) {
        filesArray.push(file);
      }
    });
    files = filesArray;

    const formObject: Record<string, any> = {};
    for (const [key, value] of params.entries()) {
      if (key !== "product_images") {
        // Handle units array (special case)
        if (key === "units" && typeof value === "string") {
          try {
            // Parse the JSON string to get the units array
            const unitsArray = JSON.parse(value);

            // Convert numeric fields in each unit object to numbers
            const processedUnits = unitsArray.map((unit: any) => ({
              ...unit,
              qty: typeof unit.qty === "string" ? Number(unit.qty) : unit.qty,
              cost:
                typeof unit.cost === "string" ? Number(unit.cost) : unit.cost,
              price:
                typeof unit.price === "string"
                  ? Number(unit.price)
                  : unit.price,
              wholeSalePrice:
                typeof unit.wholeSalePrice === "string"
                  ? Number(unit.wholeSalePrice)
                  : unit.wholeSalePrice,
              level:
                typeof unit.level === "string"
                  ? Number(unit.level)
                  : unit.level,
            }));

            formObject[key] = processedUnits;
          } catch (e) {
            console.log("Error parsing units:", e);
            formObject[key] = value;
          }
        }
        // Convert known numeric fields to numbers
        else if (
          ["qtyOnHand", "alertQty"].includes(key) &&
          typeof value === "string"
        ) {
          formObject[key] = value === "" ? 0 : Number(value);
        }
        // Handle other fields
        else {
          formObject[key] = value;
        }
      }
    }
    validatedData = await action({
      params: formObject,
      schema: CreateProductSchema,
      authorize: true,
    });
  } else {
    // Handle regular JSON object
    validatedData = await action({
      params,
      schema: CreateProductSchema,
      authorize: true,
    });
  }

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
    // Process and save the uploaded images
    const imagePaths: string[] = [];

    // If you have files to process
    if (files.length > 0) {
      // Here you would typically:
      // 1. Save the files to disk or cloud storage
      // 2. Get the URLs/paths to the saved files

      // Example for saving to local storage (you'll need to implement this)
      for (const file of files) {
        // This is a placeholder - implement your file saving logic
        const imagePath = await saveFileToStorage(file);
        imagePaths.push(imagePath);
      }
    }

    // Create the product with image paths
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
          product_images: imagePaths, // Add the image paths to the product
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
  params: EditProductParams | FormData
): Promise<ActionResponse<Product>> {
  let validatedData;
  let files: File[] = [];
  let existingImages: string[] = [];
  let imagesToDelete: string[] = [];

  // Check if params is FormData (from multipart/form-data request)
  if (params instanceof FormData) {
    // Extract files from FormData
    const filesArray: File[] = [];
    params.getAll("product_images").forEach((file) => {
      if (file instanceof File) {
        filesArray.push(file);
      }
    });
    files = filesArray;

    // Extract existing images that should be kept
    existingImages = params.getAll("existing_images").map((img) => String(img));

    // Get the product ID
    const productId = params.get("productId");

    // Fetch current product to determine which images were removed
    if (productId) {
      try {
        const currentProduct = await Product.findById(productId);
        if (currentProduct && currentProduct.product_images) {
          // Find images that were in the database but not in the existingImages array
          imagesToDelete = currentProduct.product_images.filter(
            (imagePath: string) => !existingImages.includes(imagePath)
          );
        }
      } catch (error) {
        console.error("Error fetching current product images:", error);
      }
    }

    // Convert FormData to regular object for validation
    const formObject: Record<string, any> = {};
    for (const [key, value] of params.entries()) {
      if (!["product_images", "existing_images"].includes(key)) {
        // Parse JSON strings back to objects if needed
        if (key === "units" && typeof value === "string") {
          try {
            // Parse the JSON string to get the units array
            const unitsArray = JSON.parse(value);

            // Convert numeric fields in each unit object to numbers
            const processedUnits = unitsArray.map((unit: any) => ({
              ...unit,
              qty: typeof unit.qty === "string" ? Number(unit.qty) : unit.qty,
              cost:
                typeof unit.cost === "string" ? Number(unit.cost) : unit.cost,
              price:
                typeof unit.price === "string"
                  ? Number(unit.price)
                  : unit.price,
              wholeSalePrice:
                typeof unit.wholeSalePrice === "string"
                  ? Number(unit.wholeSalePrice)
                  : unit.wholeSalePrice,
              level:
                typeof unit.level === "string"
                  ? Number(unit.level)
                  : unit.level,
            }));

            formObject[key] = processedUnits;
          } catch (e) {
            console.log("Error parsing units:", e);
            formObject[key] = value;
          }
        }
        // Convert known numeric fields to numbers
        else if (
          ["qtyOnHand", "alertQty"].includes(key) &&
          typeof value === "string"
        ) {
          formObject[key] = value === "" ? 0 : Number(value);
        }
        // Handle other fields
        else {
          formObject[key] = value;
        }
      }
    }

    validatedData = await action({
      params: formObject,
      schema: EditProductSchema,
      authorize: true,
    });
  } else {
    // Handle regular JSON object
    validatedData = await action({
      params,
      schema: EditProductSchema,
      authorize: true,
    });
  }

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

    // Update basic product fields
    if (code) product.code = code;
    if (title) product.title = title;
    if (description) product.description = description;
    if (image) product.image = image;
    if (category) product.category = category;
    if (qtyOnHand !== undefined) product.qtyOnHand = qtyOnHand;
    if (alertQty !== undefined) product.alertQty = alertQty;
    if (status) product.status = status;

    // Process and save new uploaded images
    if (
      files.length > 0 ||
      existingImages.length > 0 ||
      imagesToDelete.length > 0
    ) {
      // Process new files (save them to storage)
      const newImagePaths = [];
      for (const file of files) {
        try {
          const imagePath = await saveFileToStorage(file);
          newImagePaths.push(imagePath);
        } catch (error) {
          console.error("Error saving file:", error);
          // Continue with other files even if one fails
        }
      }

      // Delete files that were removed
      for (const imagePathToDelete of imagesToDelete) {
        try {
          await deleteFileFromStorage(imagePathToDelete);
        } catch (error) {
          console.error("Error deleting file:", error);
          // Continue with other operations even if deletion fails
        }
      }

      // Combine existing images with new image paths
      product.product_images = [...existingImages, ...newImagePaths];
    }

    await product.save({ session });

    // Handle product units
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
          !units.some(
            (u: { unit: mongoose.Types.ObjectId }) =>
              u.unit.toString() === unit._id.toString()
          )
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

// Helper function to delete files from storage
async function deleteFileFromStorage(imagePath: string): Promise<void> {
  try {
    // Extract the filename from the path
    // The imagePath will be something like "/uploads/products/1234567890-image.jpg"
    const filename = imagePath.split("/").pop();

    if (!filename) {
      console.error("Invalid image path:", imagePath);
      return;
    }

    // Construct the full file path
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    const filePath = path.join(uploadDir, filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}

async function saveFileToStorage(file: File): Promise<string> {
  // 1. Create a unique filename to prevent collisions
  const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  // 2. Define the path where to save the file
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  const filePath = path.join(uploadDir, uniqueFilename);

  // 3. Ensure the directory exists
  try {
    await fsPromises.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error);
    throw new Error("Failed to create upload directory");
  }

  // 4. Save the file
  try {
    // Convert File object to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the buffer to the file system
    fs.writeFileSync(filePath, buffer);

    // 5. Return the path to the file (as a URL path)
    return `/uploads/products/${uniqueFilename}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
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
        $sort: { "units.level": -1 }, // Sort units by level in ascending order
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
          product_images: { $first: "$product_images" },
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
  const { page = 1, pageSize = 10, query, filter, categoryId } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Product> = { status: "active" };

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { code: { $regex: new RegExp(query, "i") } },
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
            product_images: { $first: "$product_images" },
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
export async function deleteProduct(
  params: GetProductParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetProductSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { productId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const [purchaseDetails, saleDetails] = await Promise.all([
      PurchaseDetail.findOne({ product: productId }).session(session),
      SaleDetail.findOne({ product: productId }).session(session),
    ]);
    if (purchaseDetails || saleDetails) {
      throw new Error("Product បានប្រើរួចហើយ");
    }
    await ProductUnit.deleteMany({ product: productId }, { session });
    await Product.deleteOne({ _id: product._id });
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function getProductClients(
  params: ProductSearchParams
): Promise<
  ActionResponse<{ products: Product[]; totalCount: number; isNext: boolean }>
> {
  const validatedData = await action({
    params,
    schema: ProductSearchParamsSchema,
    authorize: false,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter, categoryId } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Product> = { status: "active" };

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { code: { $regex: new RegExp(query, "i") } },
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
            product_images: { $first: "$product_images" },
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
export async function getProductClient(
  params: GetProductParams
): Promise<ActionResponse<Product>> {
  const validatedData = await action({
    params,
    schema: GetProductSchema,
    authorize: false,
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
        $sort: { "units.level": -1 }, // Sort units by level in ascending order
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
          product_images: { $first: "$product_images" },
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
