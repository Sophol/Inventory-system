import { getProductQRs } from "@/lib/actions/serialNumber.action";
import ExcelJS from "exceljs";
import { ProductQRSearchParamsSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/http-errors";
import handleError from "@/lib/handlers/error";
import { ProductQR } from "@/database";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = ProductQRSearchParamsSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten().fieldErrors);
    }

    const {
      page = 1,
      pageNumber = 100000,
      query,
      filter,
      is_printed,
      status,
      generated_year,
    } = parsed.data;

    const { data } = await getProductQRs({
      page,
      pageSize: pageNumber,
      query,
      filter,
      is_printed,
      status,
      generated_year,
    });

    const productQrs = data?.productQrs ?? [];

    // Prepare host for links
    const host = request.headers.get("host");
    const protocol = host?.startsWith("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // Setup Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Product QRs");

    worksheet.columns = [
      { header: "Product Code", key: "product_code", width: 20 },
      { header: "Product Name", key: "product_name", width: 30 },
      { header: "Encrypt Serial", key: "encrypt_serial", width: 50 },
    ];

    // Fill rows & collect IDs
    const idsToUpdate: mongoose.Types.ObjectId[] = [];

    for (const item of productQrs) {
      const url = `${baseUrl}/verify?p=${item.encrypt_serial}`;
      worksheet.addRow({
        product_code: item.product_code,
        product_name: item.product_name,
        encrypt_serial: {
          text: url,
          hyperlink: url,
        },
      });

      if (item._id) {
        idsToUpdate.push(new mongoose.Types.ObjectId(item._id));
      }
    }

    // Batch update print status
    const BATCH_SIZE = 500;
    for (let i = 0; i < idsToUpdate.length; i += BATCH_SIZE) {
      const batch = idsToUpdate.slice(i, i + BATCH_SIZE);
      await ProductQR.updateMany(
        { _id: { $in: batch } },
        { $set: { is_print: true } }
      );
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=product_qrs.xlsx",
      },
    });
  } catch (error) {
    console.error("Export Product QR error:", error);
    return handleError(error, "api") as Response;
  }
}
