"use server";
import mongoose, { FilterQuery } from "mongoose";

import { ProductUnit, Sale, SaleDetail, Stock } from "@/database";
import { ISaleDetailDoc } from "@/database/sale-detail.model";
import { ISaleDoc } from "@/database/sale.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { convertToSmallUnit } from "../utils";
import {
  CreateSaleSchema,
  EditSaleSchema,
  GetSaleSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

const ObjectId = mongoose.Types.ObjectId;

export async function createSale(
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
      detail.total = detail.qty * detail.cost - detail.discount;
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
        qty: detail.qty,
      });
      const stockKey = `${branch}_${detail.product}_${smallestUnit.unit}_${smallestUnit.cost}_${smallestUnit.price}`;
      if (stockUpdates[stockKey]) {
        stockUpdates[stockKey] += qtySmallUnit;
      } else {
        stockUpdates[stockKey] = qtySmallUnit;
      }
      console.log("stockUpdates", stockUpdates);
      saleDetailDocuments.push(
        new SaleDetail({
          ...detail,
          sale: sale._id,
        })
      );
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
export async function editSale(
  params: EditSaleParams
): Promise<ActionResponse<ISaleDoc>> {
  const validatedData = await action({
    params,
    schema: EditSaleSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData.message) as ErrorResponse;
  }
  const {
    saleId,
    customer,
    branch,
    referenceNo,
    description,
    saleDate,
    discount,
    subtotal,
    grandtotal,
    paid,
    balance,
    paidBy,
    orderStatus,
    paymentStatus,
    saleDetails,
    exchangeRateD,
    exchangeRateT,
  } = validatedData.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error("Sale not found");
    }
    if (customer) sale.customer = customer;
    if (branch) sale.branch = branch;
    if (referenceNo) sale.referenceNo = referenceNo;
    if (description) sale.description = description;
    if (saleDate) sale.saleDate = saleDate;
    if (discount !== undefined) sale.discount = discount;
    if (subtotal !== undefined) sale.subtotal = subtotal;
    if (grandtotal !== undefined) sale.grandtotal = grandtotal;
    if (paid !== undefined) sale.paid = paid;
    if (balance !== undefined) sale.balance = balance;
    if (exchangeRateD) sale.exchangeRateD = exchangeRateD;
    if (exchangeRateT) sale.exchangeRateT = exchangeRateT;
    if (paidBy) sale.paidBy = paidBy;
    if (orderStatus) sale.orderStatus = orderStatus;
    if (paymentStatus) sale.paymentStatus = paymentStatus;
    await sale.save({ session });

    if (saleDetails) {
      const newDetailDocuments = [];
      const stockUpdates: { [key: string]: number } = {};
      const stockRemoves: { [key: string]: number } = {};
      for (const detail of saleDetails) {
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
          qty: detail.qty,
        });
        const stockKey = `${branch}_${detail.product}_${smallestUnit.unit}_${smallestUnit.cost}_${smallestUnit.price}`;
        if (stockUpdates[stockKey]) {
          stockUpdates[stockKey] += qtySmallUnit;
        } else {
          stockUpdates[stockKey] = qtySmallUnit;
        }

        const existingDetail = await SaleDetail.findOne({
          sale: saleId,
          product: detail.product,
          unit: detail.unit,
        }).session(session);
        if (existingDetail) {
          const existingSmallQty = convertToSmallUnit({
            level: selectedUnit.level,
            smallqty: smallestUnit.qty,
            selectedQty: selectedUnit.qty,
            qty: existingDetail.qty,
          });
          const deleteStockKey = `${branch}_${detail.product}_${smallestUnit.unit}_${smallestUnit.cost}_${smallestUnit.price}`;
          if (stockRemoves[deleteStockKey]) {
            stockRemoves[deleteStockKey] += existingSmallQty;
          } else {
            stockRemoves[deleteStockKey] = existingSmallQty;
          }

          if (detail.qty !== existingDetail.qty)
            existingDetail.qty = detail.qty;
          if (detail.cost !== existingDetail.cost)
            existingDetail.cost = detail.cost;
          if (detail.discount !== existingDetail.discount)
            existingDetail.discount = detail.discount;
          if (detail.description !== existingDetail.description)
            existingDetail.description = detail.description;
          existingDetail.total = detail.qty * detail.cost - detail.discount;
          await existingDetail.save({ session });
        } else {
          newDetailDocuments.push({ ...detail, sale: saleId });
        }
      }

      const detailsToRemove = await SaleDetail.find({
        sale: saleId,
        $nor: saleDetails.map((d) => ({
          product: d.product,
          unit: d.unit,
        })),
      }).session(session);

      if (detailsToRemove.length > 0) {
        const detailIdsToRemove = [];
        for (const rmd of detailsToRemove) {
          detailIdsToRemove.push(rmd._id);
          const productUnitRm = await ProductUnit.find({
            product: new ObjectId(rmd.product),
          });
          const smallestUnitRm = productUnitRm.find((pu) => pu.level === 1);
          if (!smallestUnitRm) {
            throw new Error(
              `Smallest unit not found for product ${rmd.product}`
            );
          }
          // Find the selected unit
          const selectedUnitRm = productUnitRm.find(
            (pu) => pu.unit.toString() === rmd.unit.toString()
          );
          if (!selectedUnitRm) {
            throw new Error(
              `Selected unit not found for product ${rmd.product}`
            );
          }
          const existingSmallQtyRm = convertToSmallUnit({
            level: selectedUnitRm.level,
            smallqty: smallestUnitRm.qty,
            selectedQty: selectedUnitRm.qty,
            qty: rmd.qty,
          });
          const deleteStockKeyRm = `${branch}_${rmd.product}_${smallestUnitRm.unit}_${smallestUnitRm.cost}_${smallestUnitRm.price}`;
          if (stockRemoves[deleteStockKeyRm]) {
            stockRemoves[deleteStockKeyRm] += existingSmallQtyRm;
          } else {
            stockRemoves[deleteStockKeyRm] = existingSmallQtyRm;
          }
        }

        await SaleDetail.deleteMany(
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
      for (const [key, qtySmallUnit] of Object.entries(stockUpdates)) {
        const [branchId, productId, unitId, cost, price] = key.split("_");

        const existingStock = await Stock.findOne({
          branch: new ObjectId(branchId),
          product: new ObjectId(productId),
          unit: new ObjectId(unitId),
        }).session(session);

        if (existingStock) {
          // Update the existing stock entry
          existingStock.qtySmallUnit =
            existingStock.qtySmallUnit + qtySmallUnit;

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
      if (newDetailDocuments.length > 0) {
        await SaleDetail.insertMany(newDetailDocuments, { session });
      }
    }
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function getSale(
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
export async function getSales(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ sales: Sale[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Sale> = {};
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
    const [totalSales, sales] = await Promise.all([
      Sale.countDocuments(filterQuery),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    console.log(sales);
    const isNext = totalSales > skip + sales.length;
    return {
      success: true,
      data: { sales: JSON.parse(JSON.stringify(sales)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getApprovedOrder(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ sales: Sale[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Sale> = { orderStatus: "approved"};
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
    const [totalSales, sales] = await Promise.all([
      Sale.countDocuments(filterQuery),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    console.log(sales);
    const isNext = totalSales > skip + sales.length;
    return {
      success: true,
      data: { sales: JSON.parse(JSON.stringify(sales)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPendingOrder(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ sales: Sale[]; isNext: boolean }>> {
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
  const filterQuery: FilterQuery<typeof Sale> = { orderStatus: "pending"};
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
    const [totalSales, sales] = await Promise.all([
      Sale.countDocuments(filterQuery),
      Sale.find(filterQuery)
        .populate("customer", "name")
        .populate("branch", "title")
        .lean()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit),
    ]);
    console.log(sales);
    const isNext = totalSales > skip + sales.length;
    return {
      success: true,
      data: { sales: JSON.parse(JSON.stringify(sales)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteSale(
  params: GetSaleParams
): Promise<ActionResponse> {
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
    const sale = await Sale.findById(saleId);
    if (!sale) {
      throw new Error("Sale not found");
    }
    const stockRemoves: { [key: string]: number } = {};
    const detailsToRemove = await SaleDetail.find({ sale: saleId });
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
        const deleteStockKeyRm = `${sale.branch}_${rmd.product}_${smallestUnitRm.unit}`;
        if (stockRemoves[deleteStockKeyRm]) {
          stockRemoves[deleteStockKeyRm] += existingSmallQtyRm;
        } else {
          stockRemoves[deleteStockKeyRm] = existingSmallQtyRm;
        }
      }

      await SaleDetail.deleteMany(
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
    await Sale.deleteOne({ _id: saleId }).session(session);
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
  export async function updateOrderStatus (
    params: GetSaleParams
  ): Promise<ActionResponse> {
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
      const sale = await Sale.findById(saleId);
      if (!sale) {
        throw new Error("Sale not found");
      }
      if ( sale.orderStatus === "pending" ) {
        sale.orderStatus  = "approved";
        await sale.save({ });
        return { success: true };
       
      } 
      else{
        return { success: false };
      }
    } catch (error) {
      await session.abortTransaction();
      return handleError(error) as ErrorResponse;
    } finally {
      await session.endSession();
    }
  }