import mongoose, { FilterQuery } from "mongoose";

import { Purchase, PurchaseDetail } from "@/database";
import { IPurchaseDetailDoc } from "@/database/purchase-detail.model";
import { IPurchaseDoc } from "@/database/purchase.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreatePurchaseSchema,
  EditPurchaseSchema,
  GetPurchaseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

const ObjectId = mongoose.Types.ObjectId;

export async function createPurchase(
  params: CreatePurchaseParams
): Promise<ActionResponse<IPurchaseDoc>> {
  const validatedData = await action({
    params,
    schema: CreatePurchaseSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    supplier,
    branch,
    referenceNo,
    description,
    purchaseDate,
    discount,
    subtotal,
    grandtoal,
    paid,
    balance,
    paidBy,
    orderStatus,
    paymentStatus,
    purchaseDetails,
  } = validatedData.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [purchase] = await Purchase.create(
      [
        {
          supplier: new ObjectId(supplier),
          branch: new ObjectId(branch),
          referenceNo,
          description,
          purchaseDate,
          discount,
          subtotal,
          grandtoal,
          paid,
          balance,
          paidBy,
          orderStatus,
          paymentStatus,
        },
      ],
      { session }
    );

    if (!purchase) {
      throw new Error("Failed to create purchase");
    }

    const purchaseDetailDocuments: IPurchaseDetailDoc[] = [];
    for (const detail of purchaseDetails) {
      purchaseDetailDocuments.push(
        new PurchaseDetail({
          ...detail,
          purchase: purchase._id,
        })
      );
    }

    await PurchaseDetail.insertMany(purchaseDetailDocuments, { session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(purchase)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function editPurchase(
  params: EditPurchaseParams
): Promise<ActionResponse<IPurchaseDoc>> {
  const validatedData = await action({
    params,
    schema: EditPurchaseSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    purchaseId,
    supplier,
    branch,
    referenceNo,
    description,
    purchaseDate,
    discount,
    subtotal,
    grandtoal,
    paid,
    balance,
    paidBy,
    orderStatus,
    paymentStatus,
    purchaseDetails,
  } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      throw new Error("Purchase not found");
    }
    if (supplier) purchase.supplier = supplier;
    if (branch) purchase.branch = branch;
    if (referenceNo) purchase.referenceNo = referenceNo;
    if (description) purchase.description = description;
    if (purchaseDate) purchase.purchaseDate = purchaseDate;
    if (discount !== undefined) purchase.discount = discount;
    if (subtotal !== undefined) purchase.subtotal = subtotal;
    if (grandtoal !== undefined) purchase.grandtoal = grandtoal;
    if (paid !== undefined) purchase.paid = paid;
    if (balance !== undefined) purchase.balance = balance;
    if (paidBy) purchase.paidBy = paidBy;
    if (orderStatus) purchase.orderStatus = orderStatus;
    if (paymentStatus) purchase.paymentStatus = paymentStatus;
    await purchase.save({ session });

    if (purchaseDetails) {
      const newDetailDocuments = [];
      for (const detail of purchaseDetails) {
        const existingDetail = await PurchaseDetail.findOne({
          purchase: purchaseId,
          product: detail.product,
          unit: detail.unit,
        }).session(session);
        if (existingDetail) {
          if (detail.qty !== undefined) existingDetail.qty = detail.qty;
          if (detail.cost !== undefined) existingDetail.cost = detail.cost;
          if (detail.total !== undefined) existingDetail.total = detail.total;
          if (detail.discount !== undefined)
            existingDetail.discount = detail.discount;
          if (detail.description !== undefined)
            existingDetail.description = detail.description;

          await existingDetail.save({ session });
        } else {
          newDetailDocuments.push({ ...detail, purchase: purchaseId });
        }
      }
      const detailsToRemove = await PurchaseDetail.find({
        purchase: purchaseId,
        $or: [
          {
            $and: [
              { product: { $nin: purchaseDetails.map((d) => d.product) } },
              { unit: { $nin: purchaseDetails.map((d) => d.unit) } },
            ],
          },
        ],
      }).session(session);
      if (detailsToRemove.length > 0) {
        const detailIdsToRemove = detailsToRemove.map((detail) => detail._id);
        await PurchaseDetail.deleteMany(
          { _id: { $in: detailIdsToRemove } },
          { session }
        );
      }
      if (newDetailDocuments.length > 0) {
        await PurchaseDetail.insertMany(newDetailDocuments, { session });
      }
    }
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(purchase)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function getPurchase(
  params: GetPurchaseParams
): Promise<ActionResponse<IPurchaseDoc>> {
  const validatedData = await action({
    params,
    schema: GetPurchaseSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { purchaseId } = validatedData.params!;
  try {
    const purchase = await Purchase.aggregate([
      { $match: { _id: new ObjectId(purchaseId) } },
      {
        $lookup: {
          from: "purchasedetails",
          localField: "_id",
          foreignField: "purchase",
          as: "details",
        },
      },
      { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "details.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          "details.product": {
            _id: "$productDetails._id",
            title: "$productDetails.title",
          },
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "details.unit",
          foreignField: "_id",
          as: "unitDetails",
        },
      },
      { $unwind: { path: "$unitDetails", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          "details.unit": {
            _id: "$unitDetails._id",
            title: "$unitDetails.title",
          },
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $unwind: { path: "$supplierDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          supplier: {
            _id: "$supplierDetails._id",
            title: "$supplierDetails.name",
          },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          branch: { _id: "$branchDetails._id", title: "$branchDetails.name" },
        },
      },
      {
        $group: {
          _id: "$_id",
          referenceNo: { $first: "$referenceNo" },
          supplier: { $first: "$supplier" },
          branch: { $first: "$branch" },
          purchaseDate: { $first: "$purchaseDate" },
          description: { $first: "$description" },
          discount: { $first: "$discount" },
          subtotal: { $first: "$subtotal" },
          grandtoal: { $first: "$grandtoal" },
          paid: { $first: "$paid" },
          balance: { $first: "$balance" },
          paidBy: { $first: "$paidBy" },
          orderStatus: { $first: "$orderStatus" },
          paymentStatus: { $first: "$paymentStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          details: { $push: "$details" },
        },
      },
    ]);
    if (purchase.length === 0) {
      throw new Error("Purchase not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(purchase[0])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getPurchases(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ purchases: Purchase[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Purchase> = {};
  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "referenceNo":
      sortCriteria = { referenceNo: -1 };
      break;
    case "orderStatus":
      sortCriteria = { orderStatus: -1 };
      break;
    case "paymentStatus":
      sortCriteria = { paymentStatus: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const [totalPurchases, purchases] = await Promise.all([
      Purchase.countDocuments(filterQuery),
      Purchase.find(filterQuery)
        .populate("supplier", "name")
        .populate("branch", "name")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);

    const isNext = totalPurchases > skip + purchases.length;
    return {
      success: true,
      data: { purchases: JSON.parse(JSON.stringify(purchases)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
