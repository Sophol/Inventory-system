import { getProductQRs } from "@/lib/actions/serialNumber.action";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pageSize = Number(searchParams.get("pageSize")) || 1000;

  const { data } = await getProductQRs({
    page: 1,
    pageSize,
  });

  const productQrs = data?.productQrs ?? [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Product QRs");

  worksheet.columns = [
    { header: "Status", key: "status", width: 12 },
    { header: "Product Code", key: "product_code", width: 20 },
    { header: "Product Name", key: "product_name", width: 30 },
    { header: "Raw Serial", key: "raw_serial", width: 30 },
    { header: "Encrypt Serial", key: "encrypt_serial", width: 30 },
    { header: "Generated Year", key: "generated_year", width: 15 },
    { header: "Expired Date", key: "expired_date", width: 20 },
    { header: "Remarks", key: "remarks", width: 30 },
  ];

  productQrs.forEach((item: any) => {
    worksheet.addRow({
      status: item.status === "1" ? "Active" : "Inactive",
      product_code: item.product_code,
      product_name: item.product_name,
      raw_serial: item.raw_serial,
      encrypt_serial: item.encrypt_serial,
      generated_year: item.generated_year,
      expired_date: item.expired_date
        ? new Date(item.expired_date).toLocaleDateString()
        : "N/A",
      remarks: item.remarks || "N/A",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=product_qrs.xlsx",
    },
  });
}
