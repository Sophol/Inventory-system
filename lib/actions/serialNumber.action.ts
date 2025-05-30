"use server";
import mongoose, { FilterQuery } from "mongoose";
import { ProductQR, ProductQRProgress } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  generateSerialNumberSchema,
  ProductQRSearchParamsSchema,
} from "../validations";
import { encrypt } from "../encryption";

export async function generateSerialNumbersAdvanced(
  params: GenerateSerialNumberParams,
  maxRetries = 3
): Promise<ActionResponse<generateSerialNumbers>> {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    const session = await mongoose.startSession();

    try {
      // Start transaction with read concern and write concern
      session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      });

      const validatedData = await action({
        params,
        schema: generateSerialNumberSchema,
        authorize: true,
      });

      if (validatedData instanceof Error) {
        await session.abortTransaction();
        return handleError(validatedData) as ErrorResponse;
      }

      const { companyCode, productCode, productName, count } =
        validatedData.params!;

      const currentYear = new Date().getFullYear();
      const yearCode = currentYear.toString().slice(-2);

      // Use findOneAndUpdate with upsert for atomic operation on progress tracking
      const progressResult = await ProductQRProgress.findOneAndUpdate(
        {
          product_code: productCode,
          generated_year: currentYear,
        },
        {
          $inc: { end_number: count },
        },
        {
          session,
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      const endNumber = progressResult.end_number;
      const startNumber = endNumber - count + 1;

      // Validate that we don't exceed the 8-digit limit
      if (endNumber > 99999999) {
        await session.abortTransaction();

        throw new Error(
          `Serial number limit exceeded. Maximum 8-digit number (99999999) reached for product ${productCode} in year ${currentYear}`
        );
      }

      // Generate all serial numbers and prepare for batch insert
      const serialNumbers: string[] = [];
      const qrCodeDocuments = [];

      for (let i = startNumber; i <= endNumber; i++) {
        const serialNumberPart = i.toString().padStart(8, "0");
        const rawSerial = `${companyCode}${productCode}${yearCode}${serialNumberPart}`;
        const encryptedSerial = encrypt(rawSerial);

        serialNumbers.push(rawSerial);

        qrCodeDocuments.push({
          raw_serial: rawSerial,
          encrypt_serial: encryptedSerial,
          product_code: productCode,
          product_name: productName,
          generated_year: currentYear,
          invalid_date: new Date(),
          end_number: i,
        });
      }

      // Batch insert with ordered: false for better performance
      const insertResult = await ProductQR.insertMany(qrCodeDocuments, {
        session,
        ordered: false,
      });

      // Commit the transaction
      await session.commitTransaction();

      // Return the complete serial numbers and range
      const startSerial = `${companyCode}${productCode}${yearCode}${startNumber.toString().padStart(8, "0")}`;
      const endSerial = `${companyCode}${productCode}${yearCode}${endNumber.toString().padStart(8, "0")}`;

      const data = {
        serialNumbers,
        range: {
          start: startSerial,
          end: endSerial,
        },
        savedCount: insertResult.length,
        retryCount,
      };

      return { success: true, data: JSON.parse(JSON.stringify(data)) };
    } catch (error) {
      await session.abortTransaction();

      // Check if it's a transient error that we should retry
      if (isTransientError(error) && retryCount < maxRetries - 1) {
        retryCount++;
        console.warn(
          `Transaction failed, retrying (${retryCount}/${maxRetries}):`,
          error
        );

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retryCount) * 100)
        );
        continue;
      }

      console.error("Transaction failed after retries:", error);

      return handleError(error) as ErrorResponse;
    } finally {
      await session.endSession();
    }
  }

  return handleError("Failed to generate serial numbers") as ErrorResponse;
}

// Helper function to determine if an error is transient and should be retried
function isTransientError(error: any): boolean {
  if (!error) return false;

  const transientErrorCodes = [
    11000, // Duplicate key error (might be resolved on retry)
    16500, // Transaction too large
    50, // ExceededTimeLimit
    89, // NetworkTimeout
    91, // ShutdownInProgress
    189, // PrimarySteppedDown
    262, // ExceededMemoryLimit
  ];

  const transientErrorLabels = [
    "TransientTransactionError",
    "UnknownTransactionCommitResult",
  ];

  // Check for MongoDB error codes
  if (error.code && transientErrorCodes.includes(error.code)) {
    return true;
  }

  // Check for error labels
  if (
    error.errorLabels &&
    error.errorLabels.some((label: string) =>
      transientErrorLabels.includes(label)
    )
  ) {
    return true;
  }

  // Check for write concern errors
  if (error.writeConcernError) {
    return true;
  }

  return false;
}

// Batch processing for very large counts
export async function generateSerialNumbersBatch(
  params: GenerateSerialNumberParams,
  batchSize = 10000
): Promise<ActionResponse<any> | ErrorResponse> {
  const { count } = params;

  if (count <= batchSize) {
    return generateSerialNumbersAdvanced(params);
  }

  const results = [];
  let remainingCount = count;
  let totalSaved = 0;

  while (remainingCount > 0) {
    const currentBatchSize = Math.min(remainingCount, batchSize);
    const batchParams = { ...params, count: currentBatchSize };

    const result = await generateSerialNumbersAdvanced(batchParams);

    if (!result.success) {
      return result;
    }

    results.push(result.data);
    if (result.data) {
      totalSaved += result.data.savedCount;
    }
    remainingCount -= currentBatchSize;

    // Small delay between batches to prevent overwhelming the database
    if (remainingCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Combine all results
  const allSerialNumbers = results.flatMap((r) => r?.serialNumbers ?? []);
  const firstResult = results[0];
  const lastResult = results[results.length - 1];

  return {
    success: true,
    data: {
      serialNumbers: allSerialNumbers,
      range: {
        start: firstResult?.range?.start ?? null,
        end: lastResult?.range?.end ?? null,
      },
      savedCount: totalSaved,
      batchCount: results.length,
    },
  };
}

export async function getQRCodeStats() {
  const currentYear = new Date().getFullYear();

  const [totalCount, activeCount, printedCount, currentYearCount] =
    await Promise.all([
      ProductQR.countDocuments({}),
      ProductQR.countDocuments({ status: 1 }),
      ProductQR.countDocuments({ is_print: true }),
      ProductQR.countDocuments({ generated_year: currentYear }),
    ]);

  return {
    total: totalCount,
    active: activeCount,
    printed: printedCount,
    currentYear: currentYearCount,
  };
}
export async function getProductQRs(params: ProductQRSearchParams): Promise<
  ActionResponse<{
    productQrs: ProductQR[];
    totalCount: number;
    isNext: boolean;
  }>
> {
  const validatedData = await action({
    params,
    schema: ProductQRSearchParamsSchema,
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
    is_printed,
    status,
    generated_year,
  } = validatedData.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof ProductQR> = {};
  if (query) {
    filterQuery.$or = [
      { product_code: { $regex: new RegExp(query, "i") } },
      { product_name: { $regex: new RegExp(query, "i") } },
      { raw_serial: { $regex: new RegExp(query, "i") } },
      { encrypt_serial: { $regex: new RegExp(query, "i") } },
    ];
  }
  let sortCriteria = {};
  switch (filter) {
    case "product_code":
      sortCriteria = { product_code: -1 };
      break;
    case "product_name":
      sortCriteria = { product_name: -1 };
      break;
    case "raw_serial":
      sortCriteria = { raw_serial: -1 };
      break;
    case "encrypt_serial":
      sortCriteria = { encrypt_serial: -1 };
      break;
    default:
      sortCriteria = { raw_serial: -1, generated_year: -1 };
      break;
  }
  if (is_printed) {
    filterQuery.is_printed = is_printed;
  }
  if (status === 0 || status === 1) {
    filterQuery.status = status;
  }
  if (generated_year) {
    filterQuery.generated_year = generated_year;
  }
  try {
    const [totalProductQrs, productQrs] = await Promise.all([
      ProductQR.countDocuments(filterQuery),
      ProductQR.find(filterQuery)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);
    const isNext = totalProductQrs > skip + productQrs.length;
    return {
      success: true,
      data: {
        productQrs: JSON.parse(JSON.stringify(productQrs)),
        totalCount: totalProductQrs,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
