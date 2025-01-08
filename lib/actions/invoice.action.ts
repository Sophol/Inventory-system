"use server";
import mongoose from "mongoose";

import { ProductUnit, Sale, SaleDetail, Stock } from "@/database";
import { ISaleDetailDoc } from "@/database/sale-detail.model";
import { ISaleDoc } from "@/database/sale.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { convertToSmallUnit } from "../utils";
import {
  ApprovedInvoiceSchema,
  CreateSaleSchema,
  GetSaleSchema,
} from "../validations";

const ObjectId = mongoose.Types.ObjectId;

export async function createInvoice(
  params: CreateSaleParams
): Promise<ActionResponse<ISaleDoc>> {
  const validatedData = await action({
    params,
    schema: CreateSaleSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    customer,
    branch,
    referenceNo,
    description,
    saleDate,
    discount,
    subtotal,
    grandtotal,
    balance,
    paidBy,
    orderStatus,
    paymentStatus,
    saleDetails,
    exchangeRateD,
    exchangeRateT,
    saleType,
  } = validatedData.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [sale] = await Sale.create(
      [
        {
          customer: new ObjectId(customer),
          branch: new ObjectId(branch),
          referenceNo,
          description,
          saleDate,
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
          saleType,
        },
      ],
      { session }
    );

    if (!sale) {
      throw new Error("Failed to create sale");
    }

    const saleDetailDocuments: ISaleDetailDoc[] = [];
    const stockUpdates: { [key: string]: number } = {};
    for (const detail of saleDetails) {
      detail.totalPrice =
        (detail.qty ?? 0) * (detail.price ?? 0) - (detail.discount ?? 0);
      detail.totalCost = (detail.qty ?? 0) * (detail.cost ?? 0);
      detail.exchangeRateD = exchangeRateD;
      detail.exchangeRateT = exchangeRateT;
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
      const stockKey = `${branch}_${detail.product}_${smallestUnit.unit}`;
      if (stockUpdates[stockKey]) {
        stockUpdates[stockKey] -= qtySmallUnit;
      } else {
        stockUpdates[stockKey] = -qtySmallUnit;
      }
      // Check stock levels before committing the transaction
      for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
        const [branchId, productId, unitId] = key.split("_");

        const existingStock = await Stock.findOne({
          branch: new ObjectId(branchId),
          product: new ObjectId(productId),
          unit: new ObjectId(unitId),
        });

        if (!existingStock || existingStock.qtySmallUnit < -qtySmallUnit) {
          throw new Error(
            `Insufficient stock for product ${productId} in branch ${branchId}`
          );
        }
      }

      // Update stock levels
      for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
        const [branchId, productId, unitId] = key.split("_");

        const existingStock = await Stock.findOne({
          branch: new ObjectId(branchId),
          product: new ObjectId(productId),
          unit: new ObjectId(unitId),
        });

        if (existingStock) {
          // Update the existing stock entry
          existingStock.qtySmallUnit += qtySmallUnit;
          await existingStock.save({ session });
        }
      }
      saleDetailDocuments.push(
        new SaleDetail({
          ...detail,
          sale: sale._id,
        })
      );
    }
    await SaleDetail.insertMany(saleDetailDocuments, { session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function voidInvoice(
  params: GetSaleParams
): Promise<ActionResponse<Sale>> {
  const validatedData = await action({
    params,
    schema: GetSaleSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { saleId } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoice = await Sale.findById(saleId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    const saleDetails = await SaleDetail.find({ sale: invoice._id });

    if (saleDetails.length > 0) {
      const stockUpdates: { [key: string]: number } = {};
      for (const detail of saleDetails) {
        const productUnits = await ProductUnit.find({
          product: new ObjectId(detail.product),
        });
        const smallestUnit = productUnits.find((pu) => pu.level === 1);
        if (!smallestUnit) {
          throw new Error(
            `Smallest unit not found for product ${detail.product}`
          );
        }
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
          qty: detail.qty,
        });
        const stockKey = `${invoice.branch}_${detail.product}_${smallestUnit.unit}`;
        if (stockUpdates[stockKey]) {
          stockUpdates[stockKey] += qtySmallUnit;
        } else {
          stockUpdates[stockKey] = qtySmallUnit;
        }
      }

      for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
        const [branchId, productId, unitId] = key.split("_");
        const existingStock = await Stock.findOne({
          branch: new ObjectId(branchId),
          product: new ObjectId(productId),
          unit: new ObjectId(unitId),
        });
        console.log("existingStock", existingStock);
        if (existingStock) {
          existingStock.qtySmallUnit += qtySmallUnit;
          await existingStock.save({ session });
        }
      }
      invoice.orderStatus = "void";
      await invoice.save({ session });
    }
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function approvedInvoice(
  params: ApprovedInvoiceParams
): Promise<ActionResponse<Sale>> {
  const validatedData = await action({
    params,
    schema: ApprovedInvoiceSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { saleId, dueDate } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoice = await Sale.findById(saleId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    if (invoice.orderStatus !== "approved") {
      throw new Error("Invoice not approved yet");
    }
    const saleDetails = await SaleDetail.find({ sale: saleId });
    if (saleDetails.length > 0) {
      const stockUpdates: { [key: string]: number } = {};
      for (const detail of saleDetails) {
        const productUnits = await ProductUnit.find({
          product: new ObjectId(detail.product),
        });
        const smallestUnit = productUnits.find((pu) => pu.level === 1);
        if (!smallestUnit) {
          throw new Error(
            `Smallest unit not found for product ${detail.product}`
          );
        }
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
          qty: detail.qty,
        });
        const stockKey = `${invoice.branch}_${detail.product}_${smallestUnit.unit}`;
        if (stockUpdates[stockKey]) {
          stockUpdates[stockKey] -= qtySmallUnit;
        } else {
          stockUpdates[stockKey] = -qtySmallUnit;
        }
      }
      // Check stock levels before committing the transaction
      for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
        const [branchId, productId, unitId] = key.split("_");

        const existingStock = await Stock.findOne({
          branch: new ObjectId(branchId),
          product: new ObjectId(productId),
          unit: new ObjectId(unitId),
        });

        if (!existingStock || existingStock.qtySmallUnit < -qtySmallUnit) {
          throw new Error(
            `Insufficient stock for product ${productId} in branch ${branchId}`
          );
        }
      }

      // Update stock levels
      for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
        const [branchId, productId, unitId] = key.split("_");

        const existingStock = await Stock.findOne({
          branch: new ObjectId(branchId),
          product: new ObjectId(productId),
          unit: new ObjectId(unitId),
        });

        if (existingStock) {
          // Update the existing stock entry
          existingStock.qtySmallUnit += qtySmallUnit;
          await existingStock.save({ session });
        }
      }
      invoice.orderStatus = "completed";
      invoice.dueDate = dueDate;
      await invoice.save({ session });
    }
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getInvoice(
  params: GetSaleParams
): Promise<ActionResponse<Sale>> {
  const validatedData = await action({
    params,
    schema: GetSaleSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { saleId } = validatedData.params!;
  try {
    const sale = await Sale.aggregate([
      { $match: { _id: new ObjectId(saleId) } },
      {
        $lookup: {
          from: "saledetails",
          localField: "_id",
          foreignField: "sale",
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
          customer: { $first: "$customer" },
          branch: { $first: "$branch" },
          orderDate: { $first: "$orderDate" },
          approvedDate: { $first: "$approvedDate" },
          invoicedDate: { $first: "$invoicedDate" },
          tax: { $first: "$tax" },
          description: { $first: "$description" },
          discount: { $first: "$discount" },
          subtotal: { $first: "$subtotal" },
          grandtotal: { $first: "$grandtotal" },
          paid: { $first: "$paid" },
          balance: { $first: "$balance" },
          paidBy: { $first: "$paidBy" },
          saleType: { $first: "$saleType" },
          orderStatus: { $first: "$orderStatus" },
          paymentStatus: { $first: "$paymentStatus" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          saleDetails: { $push: "$details" },
        },
      },
    ]);

    if (sale.length === 0) {
      throw new Error("Sale not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(sale[0])) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
