"use server";
import mongoose, { FilterQuery } from "mongoose";

import { ProductUnit, Purchase, PurchaseDetail, Stock } from "@/database";
import { IPurchaseDetailDoc } from "@/database/purchase-detail.model";
import { IPurchaseDoc } from "@/database/purchase.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { convertToSmallUnit } from "../utils";
import {
  ApprovedPurchaseSchema,
  CreatePurchaseSchema,
  EditPurchaseSchema,
  GetPurchaseSchema,
  PurchaseSearchParamsSchema,
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
    grandtotal,
    balance,
    paidBy,
    orderStatus,
    paymentStatus,
    purchaseDetails,
    exchangeRateD,
    exchangeRateT,
    deliveryIn,
    deliveryOut,
    shippingFee,
    serviceFee,
    customer,
  } = validatedData.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingPurchase = await Purchase.findOne({
      referenceNo: referenceNo,
    });
    if (existingPurchase) throw new Error("Reference number already exists");
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
          grandtotal,
          paid: grandtotal,
          balance,
          paidBy,
          orderStatus,
          paymentStatus,
          exchangeRateD,
          exchangeRateT,
          deliveryIn,
          deliveryOut,
          shippingFee,
          serviceFee,
          customer: new ObjectId(customer),
        },
      ],
      { session }
    );

    if (!purchase) {
      throw new Error("Failed to create purchase");
    }

    const purchaseDetailDocuments: IPurchaseDetailDoc[] = [];
    //const stockUpdates: { [key: string]: number } = {};
    for (const detail of purchaseDetails) {
      if (detail.qty !== undefined) {
        if (detail.cost !== undefined) {
          detail.total = detail.qty * detail.cost - (detail.discount ?? 0);
        } else {
          throw new Error(`Cost is undefined for product ${detail.product}`);
        }
      } else {
        throw new Error(`Quantity is undefined for product ${detail.product}`);
      }
      detail.exchangeRateD = exchangeRateD;
      detail.exchangeRateT = exchangeRateT;
      // const productUnits = await ProductUnit.find({
      //   product: new ObjectId(detail.product),
      // });

      // Find the smallest unit (level = 1)
      // const smallestUnit = productUnits.find((pu) => pu.level === 1);
      // if (!smallestUnit) {
      //   throw new Error(
      //     `Smallest unit not found for product ${detail.product}`
      //   );
      // }

      // Find the selected unit
      // const selectedUnit = productUnits.find(
      //   (pu) => pu.unit.toString() === detail.unit.toString()
      // );

      // if (!selectedUnit) {
      //   throw new Error(
      //     `Selected unit not found for product ${detail.product}`
      //   );
      // }
      // const qtySmallUnit = convertToSmallUnit({
      //   level: selectedUnit.level,
      //   smallqty: smallestUnit.qty,
      //   selectedQty: selectedUnit.qty,
      //   qty: detail.qty!,
      // });
      // const stockKey = `${branch}_${detail.product}_${smallestUnit.unit}_${smallestUnit.cost}_${smallestUnit.price}`;
      // if (stockUpdates[stockKey]) {
      //   stockUpdates[stockKey] += qtySmallUnit;
      // } else {
      //   stockUpdates[stockKey] = qtySmallUnit;
      // }
      purchaseDetailDocuments.push(
        new PurchaseDetail({
          ...detail,
          purchase: purchase._id,
        })
      );
    }
    // for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
    //   const [branchId, productId, unitId, cost, price] = key.split("_");

    //   const existingStock = await Stock.findOne({
    //     branch: new ObjectId(branchId),
    //     product: new ObjectId(productId),
    //     unit: new ObjectId(unitId),
    //   });

    //   if (existingStock) {
    //     // Update the existing stock entry
    //     existingStock.qtySmallUnit += qtySmallUnit;
    //     await existingStock.save({ session });
    //   } else {
    //     // Create a new stock entry
    //     await Stock.create(
    //       [
    //         {
    //           branch: new ObjectId(branchId),
    //           product: new ObjectId(productId),
    //           unit: new ObjectId(unitId),
    //           qtySmallUnit,
    //           cost: parseFloat(cost), // Set appropriate cost
    //           price: parseFloat(price), // Set appropriate price
    //         },
    //       ],
    //       { session }
    //     );
    //   }
    // }

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
    grandtotal,
    paid,
    balance,
    paidBy,
    orderStatus,
    paymentStatus,
    purchaseDetails,
    exchangeRateD,
    exchangeRateT,
    deliveryIn,
    deliveryOut,
    shippingFee,
    serviceFee,
    customer,
  } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      throw new Error("Purchase not found");
    }
    if (supplier !== purchase.supplier) purchase.supplier = supplier;
    if (branch !== purchase.branch) purchase.branch = branch;
    if (referenceNo !== purchase.referenceNo)
      purchase.referenceNo = referenceNo;
    if (description !== purchase.description)
      purchase.description = description;
    if (purchaseDate !== purchase.purchaseDate)
      purchase.purchaseDate = purchaseDate;
    if (discount !== purchase.discount) purchase.discount = discount;
    if (subtotal !== purchase.subtotal) purchase.subtotal = subtotal;
    if (grandtotal !== purchase.grandtotal) purchase.grandtotal = grandtotal;
    if (paid !== purchase.grandtotal) purchase.paid = grandtotal;
    if (balance !== purchase.balance) purchase.balance = balance;
    if (exchangeRateD !== purchase.exchangeRateD)
      purchase.exchangeRateD = exchangeRateD;
    if (exchangeRateT !== purchase.exchangeRateT)
      purchase.exchangeRateT = exchangeRateT;
    if (paidBy !== purchase.paidBy) purchase.paidBy = paidBy;
    if (orderStatus !== purchase.orderStatus)
      purchase.orderStatus = orderStatus;
    if (paymentStatus !== purchase.paymentStatus)
      purchase.paymentStatus = paymentStatus;
    if (deliveryIn !== purchase.deliveryIn) purchase.deliveryIn = deliveryIn;
    if (deliveryOut !== purchase.deliveryOut)
      purchase.deliveryOut = deliveryOut;
    if (shippingFee !== purchase.shippingFee)
      purchase.shippingFee = shippingFee;
    if (serviceFee !== purchase.serviceFee) purchase.serviceFee = serviceFee;
    if (customer !== purchase.customer) purchase.customer = customer;
    await purchase.save({ session });

    if (purchaseDetails) {
      const newDetailDocuments = [];
      //const stockUpdates: { [key: string]: number } = {};
      //const stockRemoves: { [key: string]: number } = {};
      for (const detail of purchaseDetails) {
        // const productUnits = await ProductUnit.find({
        //   product: new ObjectId(detail.product),
        // });
        // Find the smallest unit (level = 1)
        // const smallestUnit = productUnits.find((pu) => pu.level === 1);
        // if (!smallestUnit) {
        //   throw new Error(
        //     `Smallest unit not found for product ${detail.product}`
        //   );
        // }
        // Find the selected unit
        // const selectedUnit = productUnits.find(
        //   (pu) => pu.unit.toString() === detail.unit.toString()
        // );
        // if (!selectedUnit) {
        //   throw new Error(
        //     `Selected unit not found for product ${detail.product}`
        //   );
        // }
        // const qtySmallUnit = convertToSmallUnit({
        //   level: selectedUnit.level,
        //   smallqty: smallestUnit.qty,
        //   selectedQty: selectedUnit.qty,
        //   qty: detail.qty!,
        // });
        // const stockKey = `${branch}_${detail.product}_${smallestUnit.unit}_${smallestUnit.cost}_${smallestUnit.price}`;
        // if (stockUpdates[stockKey]) {
        //   stockUpdates[stockKey] += qtySmallUnit;
        // } else {
        //   stockUpdates[stockKey] = qtySmallUnit;
        // }

        const existingDetail = await PurchaseDetail.findOne({
          purchase: purchaseId,
          product: detail.product,
          unit: detail.unit,
        }).session(session);
        if (existingDetail) {
          // const existingSmallQty = convertToSmallUnit({
          //   level: selectedUnit.level,
          //   smallqty: smallestUnit.qty,
          //   selectedQty: selectedUnit.qty,
          //   qty: existingDetail.qty,
          // });
          // const deleteStockKey = `${branch}_${detail.product}_${smallestUnit.unit}_${smallestUnit.cost}_${smallestUnit.price}`;
          // if (stockRemoves[deleteStockKey]) {
          //   stockRemoves[deleteStockKey] += existingSmallQty;
          // } else {
          //   stockRemoves[deleteStockKey] = existingSmallQty;
          // }

          if (detail.qty !== existingDetail.qty)
            existingDetail.qty = detail.qty;
          if (detail.cost !== existingDetail.cost)
            existingDetail.cost = detail.cost;
          if (detail.discount !== existingDetail.discount)
            existingDetail.discount = detail.discount;
          if (detail.description !== existingDetail.description)
            existingDetail.description = detail.description;
          existingDetail.total =
            (detail.qty ?? 0) * (detail.cost ?? 0) - (detail.discount ?? 0);
          await existingDetail.save({ session });
        } else {
          newDetailDocuments.push({ ...detail, purchase: purchaseId });
        }
      }

      const detailsToRemove = await PurchaseDetail.find({
        purchase: purchaseId,
        $nor: purchaseDetails.map((d) => ({
          product: d.product,
          unit: d.unit,
        })),
      }).session(session);

      if (detailsToRemove.length > 0) {
        const detailIdsToRemove = [];
        for (const rmd of detailsToRemove) {
          detailIdsToRemove.push(rmd._id);
          // const productUnitRm = await ProductUnit.find({
          //   product: new ObjectId(rmd.product),
          // });
          // const smallestUnitRm = productUnitRm.find((pu) => pu.level === 1);
          // if (!smallestUnitRm) {
          //   throw new Error(
          //     `Smallest unit not found for product ${rmd.product}`
          //   );
          // }
          // Find the selected unit
          // const selectedUnitRm = productUnitRm.find(
          //   (pu) => pu.unit.toString() === rmd.unit.toString()
          // );
          // if (!selectedUnitRm) {
          //   throw new Error(
          //     `Selected unit not found for product ${rmd.product}`
          //   );
          // }
          // const existingSmallQtyRm = convertToSmallUnit({
          //   level: selectedUnitRm.level,
          //   smallqty: smallestUnitRm.qty,
          //   selectedQty: selectedUnitRm.qty,
          //   qty: rmd.qty,
          // });
          // const deleteStockKeyRm = `${branch}_${rmd.product}_${smallestUnitRm.unit}_${smallestUnitRm.cost}_${smallestUnitRm.price}`;
          // if (stockRemoves[deleteStockKeyRm]) {
          //   stockRemoves[deleteStockKeyRm] += existingSmallQtyRm;
          // } else {
          //   stockRemoves[deleteStockKeyRm] = existingSmallQtyRm;
          // }
        }

        await PurchaseDetail.deleteMany(
          { _id: { $in: detailIdsToRemove } },
          { session }
        );
      }
      // for (const [key, qtySmallUnitRm] of Object.entries(stockRemoves)) {
      //   const [branchId, productId, unitId] = key.split("_");

      //   const existingStockRm = await Stock.findOne({
      //     branch: new ObjectId(branchId),
      //     product: new ObjectId(productId),
      //     unit: new ObjectId(unitId),
      //   }).session(session);
      //   if (existingStockRm) {
      //     // Update the existing stock entry
      //     existingStockRm.qtySmallUnit = Math.max(
      //       0,
      //       existingStockRm.qtySmallUnit - qtySmallUnitRm
      //     );

      //     await existingStockRm.save({ session });
      //   }
      // }
      // for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
      //   const [branchId, productId, unitId, cost, price] = key.split("_");

      //   const existingStock = await Stock.findOne({
      //     branch: new ObjectId(branchId),
      //     product: new ObjectId(productId),
      //     unit: new ObjectId(unitId),
      //   }).session(session);

      //   if (existingStock) {
      //     // Update the existing stock entry
      //     existingStock.qtySmallUnit =
      //       existingStock.qtySmallUnit + qtySmallUnit;

      //     await existingStock.save({ session });
      //   } else {
      //     // Create a new stock entry
      //     await Stock.create(
      //       [
      //         {
      //           branch: new ObjectId(branchId),
      //           product: new ObjectId(productId),
      //           unit: new ObjectId(unitId),
      //           qtySmallUnit,
      //           cost: parseFloat(cost), // Set appropriate cost
      //           price: parseFloat(price), // Set appropriate price
      //         },
      //       ],
      //       { session }
      //     );
      //   }
      // }
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
): Promise<ActionResponse<Purchase>> {
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
          "details.selectedProduct": {
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
          "details.selectedUnit": {
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
            phone: "$supplierDetails.phone",
          },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          customer: {
            _id: "$customerDetails._id",
            title: "$customerDetails.name",
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
          branch: { _id: "$branchDetails._id", title: "$branchDetails.title" },
        },
      },
      {
        $group: {
          _id: "$_id",
          referenceNo: { $first: "$referenceNo" },
          supplier: { $first: "$supplier" },
          branch: { $first: "$branch" },
          customer: { $first: "$customer" },
          purchaseDate: { $first: "$purchaseDate" },
          description: { $first: "$description" },
          discount: { $first: "$discount" },
          subtotal: { $first: "$subtotal" },
          grandtotal: { $first: "$grandtotal" },
          paid: { $first: "$paid" },
          balance: { $first: "$balance" },
          paidBy: { $first: "$paidBy" },
          deliveryIn: { $first: "$deliveryIn" },
          deliveryOut: { $first: "$deliveryOut" },
          shippingFee: { $first: "$shippingFee" },
          serviceFee: { $first: "$serviceFee" },
          orderStatus: { $first: "$orderStatus" },
          paymentStatus: { $first: "$paymentStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          purchaseDetails: { $push: "$details" },
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
export async function getPurchases(params: PurchaseSearchParams): Promise<
  ActionResponse<{
    purchases: Purchase[];
    summary: { count: 0; totalGrandtotal: 0 };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: PurchaseSearchParamsSchema,
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
    supplierId,
    branchId,
    dateRange,
    customerId,
  } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Purchase> = {
    orderStatus: "pending",
  };

  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }

  if (supplierId) {
    filterQuery.supplier = new ObjectId(supplierId);
  }
  if (customerId) {
    filterQuery.customer = new ObjectId(customerId);
  }

  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }

  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.purchaseDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
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
    const [aggregationResult, purchases] = await Promise.all([
      Purchase.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalGrandtotal: { $sum: "$grandtotal" },
          },
        },
      ]),
      Purchase.find(filterQuery)
        .populate("supplier", "name")
        .populate("branch", "title")
        .populate("customer", "name")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const transformedPurchases = purchases.map((purchase) => ({
      ...purchase,
      customer: purchase.customer ? { title: purchase.customer.name } : null,
      supplier: purchase.supplier ? { title: purchase.supplier.name } : null,
    }));
    const count = aggregationResult[0]?.count || 0;
    const totalGrandtotal = aggregationResult[0]?.totalGrandtotal || 0;
    const isNext = count > skip + transformedPurchases.length;
    const totalCount = { count, totalGrandtotal };
    return {
      success: true,
      data: {
        purchases: JSON.parse(JSON.stringify(transformedPurchases)),
        summary: JSON.parse(JSON.stringify(totalCount)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deletePurchase(
  params: GetPurchaseParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetPurchaseSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { purchaseId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      throw new Error("Purchase not found");
    }
    //const stockRemoves: { [key: string]: number } = {};
    const detailsToRemove = await PurchaseDetail.find({ purchase: purchaseId });
    if (detailsToRemove.length > 0) {
      const detailIdsToRemove = [];
      for (const rmd of detailsToRemove) {
        detailIdsToRemove.push(rmd._id);
        //   const productUnitRm = await ProductUnit.find({
        //     product: new ObjectId(rmd.product),
        //   });
        //   const smallestUnitRm = productUnitRm.find((pu) => pu.level === 1);
        //   if (!smallestUnitRm) {
        //     throw new Error(`Smallest unit not found for product ${rmd.product}`);
        //   }
        //   // Find the selected unit
        //   const selectedUnitRm = productUnitRm.find(
        //     (pu) => pu.unit.toString() === rmd.unit.toString()
        //   );
        //   if (!selectedUnitRm) {
        //     throw new Error(`Selected unit not found for product ${rmd.product}`);
        //   }
        //   const existingSmallQtyRm = convertToSmallUnit({
        //     level: selectedUnitRm.level,
        //     smallqty: smallestUnitRm.qty,
        //     selectedQty: selectedUnitRm.qty,
        //     qty: rmd.qty,
        //   });
        //   const deleteStockKeyRm = `${purchase.branch}_${rmd.product}_${smallestUnitRm.unit}`;
        //   if (stockRemoves[deleteStockKeyRm]) {
        //     stockRemoves[deleteStockKeyRm] += existingSmallQtyRm;
        //   } else {
        //     stockRemoves[deleteStockKeyRm] = existingSmallQtyRm;
        //   }
      }

      await PurchaseDetail.deleteMany(
        { _id: { $in: detailIdsToRemove } },
        { session }
      );
    }
    // for (const [key, qtySmallUnitRm] of Object.entries(stockRemoves)) {
    //   const [branchId, productId, unitId] = key.split("_");

    //   const existingStockRm = await Stock.findOne({
    //     branch: new ObjectId(branchId),
    //     product: new ObjectId(productId),
    //     unit: new ObjectId(unitId),
    //   }).session(session);
    //   if (existingStockRm) {
    //     // Update the existing stock entry
    //     existingStockRm.qtySmallUnit = Math.max(
    //       0,
    //       existingStockRm.qtySmallUnit - qtySmallUnitRm
    //     );

    //     await existingStockRm.save({ session });
    //   }
    // }
    await Purchase.deleteOne({ _id: purchaseId }).session(session);
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function approvedPurchase(
  params: ApprovedPurchaseParams
): Promise<ActionResponse<Purchase>> {
  const validatedData = await action({
    params,
    schema: ApprovedPurchaseSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { purchaseId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(purchaseId).session(session);
    if (!purchase) {
      throw new Error("Purchase not found");
    }
    if (purchase.orderStatus !== "pending") {
      throw new Error("Purchase already approved");
    }
    const purchaseDetails = await PurchaseDetail.find({
      purchase: purchase._id,
    }).session(session);
    if (purchaseDetails.length === 0) {
      throw new Error("Purchase details not found");
    }
    const stockUpdates: { [key: string]: number } = {};
    for (const detail of purchaseDetails) {
      if (detail.qty !== undefined) {
        if (detail.cost !== undefined) {
          detail.total = detail.qty * detail.cost - (detail.discount ?? 0);
        } else {
          throw new Error(`Cost is undefined for product ${detail.product}`);
        }
      } else {
        throw new Error(`Quantity is undefined for product ${detail.product}`);
      }

      const productUnits = await ProductUnit.find({
        product: new ObjectId(detail.product),
      });

      // Find the smallest unit (level = 1)
      const smallestUnit = productUnits.find((pu) => pu.level === 1);
      if (!smallestUnit) {
        throw new Error(
          `Smallest unit not found for product ${detail.product}`
        );
      }
      // Find the selected unit
      const selectedUnit = productUnits.find(
        (pu) => pu.unit.toString() === detail.unit.toString()
      );

      if (!selectedUnit) {
        throw new Error(
          `Selected unit not found for product ${detail.product}`
        );
      }
      const qtySmallUnit = convertToSmallUnit({
        level: selectedUnit.level,
        smallqty: smallestUnit.qty,
        selectedQty: selectedUnit.qty,
        qty: detail.qty!,
      });
      const stockKey = `${purchase.branch}_${detail.product}_${smallestUnit.unit}_${smallestUnit.cost}_${smallestUnit.price}`;
      if (stockUpdates[stockKey]) {
        stockUpdates[stockKey] += qtySmallUnit;
      } else {
        stockUpdates[stockKey] = qtySmallUnit;
      }
    }
    for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
      const [branchId, productId, unitId, cost, price] = key.split("_");

      const existingStock = await Stock.findOne({
        branch: new ObjectId(branchId),
        product: new ObjectId(productId),
        unit: new ObjectId(unitId),
      });

      if (existingStock) {
        // Update the existing stock entry
        existingStock.qtySmallUnit += qtySmallUnit;
        await existingStock.save({ session });
      } else {
        // Create a new stock entry
        await Stock.create(
          [
            {
              branch: new ObjectId(branchId),
              product: new ObjectId(productId),
              unit: new ObjectId(unitId),
              qtySmallUnit,
              cost: parseFloat(cost), // Set appropriate cost
              price: parseFloat(price), // Set appropriate price
            },
          ],
          { session }
        );
      }
    }
    purchase.orderStatus = "completed";
    await purchase.save({ session });
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(purchase)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function deletePurchaseApproved(
  params: GetPurchaseParams
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: GetPurchaseSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { purchaseId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      throw new Error("Purchase not found");
    }
    const stockRemoves: { [key: string]: number } = {};
    const detailsToRemove = await PurchaseDetail.find({ purchase: purchaseId });
    if (detailsToRemove.length > 0) {
      const detailIdsToRemove = [];
      for (const rmd of detailsToRemove) {
        detailIdsToRemove.push(rmd._id);
        const productUnitRm = await ProductUnit.find({
          product: new ObjectId(rmd.product),
        });
        const smallestUnitRm = productUnitRm.find((pu) => pu.level === 1);
        if (!smallestUnitRm) {
          throw new Error(`Smallest unit not found for product ${rmd.product}`);
        }
        // Find the selected unit
        const selectedUnitRm = productUnitRm.find(
          (pu) => pu.unit.toString() === rmd.unit.toString()
        );
        if (!selectedUnitRm) {
          throw new Error(`Selected unit not found for product ${rmd.product}`);
        }
        const existingSmallQtyRm = convertToSmallUnit({
          level: selectedUnitRm.level,
          smallqty: smallestUnitRm.qty,
          selectedQty: selectedUnitRm.qty,
          qty: rmd.qty,
        });
        const deleteStockKeyRm = `${purchase.branch}_${rmd.product}_${smallestUnitRm.unit}`;
        if (stockRemoves[deleteStockKeyRm]) {
          stockRemoves[deleteStockKeyRm] += existingSmallQtyRm;
        } else {
          stockRemoves[deleteStockKeyRm] = existingSmallQtyRm;
        }
      }

      await PurchaseDetail.deleteMany(
        { _id: { $in: detailIdsToRemove } },
        { session }
      );
    }
    for (const [key, qtySmallUnitRm] of Object.entries(stockRemoves)) {
      const [branchId, productId, unitId] = key.split("_");

      const existingStockRm = await Stock.findOne({
        branch: new ObjectId(branchId),
        product: new ObjectId(productId),
        unit: new ObjectId(unitId),
      }).session(session);
      if (existingStockRm) {
        // Update the existing stock entry
        existingStockRm.qtySmallUnit = Math.max(
          0,
          existingStockRm.qtySmallUnit - qtySmallUnitRm
        );

        await existingStockRm.save({ session });
      }
    }
    await Purchase.deleteOne({ _id: purchaseId }).session(session);
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function getPurchaseCompleted(
  params: PurchaseSearchParams
): Promise<
  ActionResponse<{
    purchases: Purchase[];
    summary: { count: 0; totalGrandtotal: 0 };
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: PurchaseSearchParamsSchema,
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
    supplierId,
    branchId,
    dateRange,
    customerId,
    orderStatus,
  } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Purchase> = {
    orderStatus: "completed",
  };

  if (query) {
    filterQuery.$or = [
      { referenceNo: { $regex: new RegExp(query, "i") } },
      { description: { $regex: new RegExp(query, "i") } },
      { orderStatus: { $regex: new RegExp(query, "i") } },
      { paymentStatus: { $regex: new RegExp(query, "i") } },
    ];
  }

  if (supplierId) {
    filterQuery.supplier = new ObjectId(supplierId);
  }
  if (customerId) {
    filterQuery.customer = new ObjectId(customerId);
  }
  if (branchId) {
    filterQuery.branch = new ObjectId(branchId);
  }
  if (orderStatus) {
    filterQuery.orderStatus = orderStatus;
  }

  if (dateRange) {
    const [from, to] = dateRange.split("_");
    filterQuery.purchaseDate = {
      $gte: new Date(
        Date.UTC(
          new Date(from).getFullYear(),
          new Date(from).getMonth(),
          new Date(from).getDate()
        )
      ),
      $lte: new Date(
        Date.UTC(
          new Date(to).getFullYear(),
          new Date(to).getMonth(),
          new Date(to).getDate(),
          23,
          59,
          59
        )
      ),
    };
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
    const [aggregationResult, purchases] = await Promise.all([
      Purchase.aggregate([
        { $match: filterQuery },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalGrandtotal: { $sum: "$grandtotal" },
          },
        },
      ]),
      Purchase.find(filterQuery)
        .populate("supplier", "name")
        .populate("branch", "title")
        .populate("customer", "name")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    const transformedPurchases = purchases.map((purchase) => ({
      ...purchase,
      customer: purchase.customer ? { title: purchase.customer.name } : null,
      supplier: purchase.supplier ? { title: purchase.supplier.name } : null,
    }));
    const count = aggregationResult[0]?.count || 0;
    const totalGrandtotal = aggregationResult[0]?.totalGrandtotal || 0;
    const isNext = count > skip + transformedPurchases.length;
    const totalCount = { count, totalGrandtotal };
    return {
      success: true,
      data: {
        purchases: JSON.parse(JSON.stringify(transformedPurchases)),
        summary: JSON.parse(JSON.stringify(totalCount)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
