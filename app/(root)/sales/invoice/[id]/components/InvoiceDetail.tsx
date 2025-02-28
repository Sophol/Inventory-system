import React from "react";
import "../invoice.css";
import { getSetting } from "@/lib/actions/setting.action";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("km-KH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\./g, ","); // Replace dot with comma
};

const InvoiceDetail = async ({ invoice }: { invoice: Sale }) => {

  const { success, data: setting } = await getSetting({
    settingId: process.env.SETTING_ID as string,
  });
  if (!success) return notFound();
  if (!setting) return notFound();
  return (
    <div className="card80  pb-0">
      <div className="printable-area card80-container pb-0">
        <div className="sm:flex flex-row justify-between invoice-header my-0 py-0 px-0">

          {invoice.isLogo !== "false" && (
            <div className="flex flex-col ">
              <Image
                src={`/` + setting.companyLogo}
                alt="Company Logo"
                width={100}
                height={100}
                className="w-auto sm:w-[100] h-20 object-contain logo"
              />
              <p className="text-[12px] pt-0 pb-0 mx-auto sm:mx-0 font-bold">{setting.companyName}</p>
              <p className="text-[12px] pb-0 mx-auto sm:mx-0 bold">{setting.companyNameEnglish}</p>
              <p className="text-[9px] mx-auto sm:mx-0 address">
                {setting.address}
              </p>
              <p className="text-[9px] mx-auto sm:mx-0">
                {setting.phone}
              </p>
            </div>
          )}

          <div className="flex flex-col px-0 mt-0  py-0">
            <h1 className="font-bold text-[11px] pt-1 mx-auto sm:mx-0 pb-3 invoice-ref" ># {invoice.referenceNo}</h1>
            <p className="text-[11px] pt-2">
              <span className="pr-2">ថ្ងៃចេញ:</span>
              {invoice.dueDate ? format(new Date(invoice.invoicedDate), "dd/MM/yyyy hh:mm:ss ") : "N/A"}
            </p>
            <p className="text-[11px]">
              <span className="pr-2">ថ្ងៃកំណត់:</span>
              {invoice.dueDate ? format(new Date(invoice.dueDate), "dd/MM/yyyy hh:mm:ss ") : "N/A"}
            </p>
          </div>
        </div>

        <div className="sale-details bg-white rounded-lg shadow-sm mt-2">
          <div className="flex gap-2 border-b pb-1 px-2 text-[11px]   ">
            <p className="w-1/4 font-bold  pl-2 pr-1 data-for-print print-h1">ទំនិញ</p>
            <p className="w-1/4 font-bold px-1 data-for-print print-h2">តម្លៃ</p>
            <p className="w-1/4 font-bold px-1 data-for-print print-h3">ចំនួន</p>
            <p className="w-1/4 font-bold pl-1 pr-2 data-for-print print-h4 text-center">សរុប</p>
          </div>
          {invoice.saleDetails.map((detail, index) => (
            <div
              key={index}
              className="flex gap-2 border-b pt-1 last:border-b-0 px-2 text-[11px] "
            >
              <p className="w-1/4 pl-2 pr-1 data-for-print print-d1">{detail.selectedProduct?.title}</p>
              <p className="w-1/4 px-1 data-for-print print-d2">
                {detail.price !== undefined
                  ? formatCurrency(detail.price)
                  : "N/A"}
              </p>
              <p className="w-1/4 px-1 data-for-print print-d3">
                {detail.qty}{" "}
                {detail.selectedUnit ? detail.selectedUnit.title : "N/A"}
              </p>
              <p className="w-1/4 pl-1 pr-2 data-for-print print-d4 text-right">
                {detail.price !== undefined && detail.qty !== undefined
                  ? formatCurrency(detail.price * detail.qty)
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 invoice-body">
          <div className="pt-0 invoice-note text-left ">
            {invoice.isLogo !== "false" && (
              <div className="flex flex-col ">
                <Image
                  src={`/images/company_telegram_qr.jpg`}
                  alt="Company Telegram QR"
                  width={100}
                  height={100}
                  className="w-[70] h-20 object-contain pt-1 grayscale ml-9"
                />
                <span className="text-[10px] mt-0 ml-[49px]">Telegram</span>
              </div>

            )}

          </div>

          <div className=" invoice-total mt-2 text-[11px] pr-1" >
            <div className="sub-info" style={{ color: "black" }}>
              <div className="flex gap-2">
                <p className="pb-1 w-1/3" style={{ color: "black" }}>ថ្លៃទំនិញ:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.subtotal ? formatCurrency(invoice.subtotal) : "0"}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="pb-1 w-1/3 ">ចុះតម្លៃ: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.discount ? formatCurrency(invoice.discount) : "0"}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="pb-1 w-1/3">ថ្លៃដឹក: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.delivery ? invoice.delivery : "0"}
                </p>
              </div>
              <hr className="border-t-2 border-gray-400 mt-0 mb-1" />
              <div className="flex gap-2">
                <p className="pb-1 w-1/3">សរុប: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.grandtotal
                    ? formatCurrency(invoice.grandtotal)
                    : "0"}
                </p>
              </div>

            </div>

            <div></div>
          </div>
        


        </div>

<div className="flex w-full">

  <div className="flex row gap-4 mt-3 w-full">
    <div className=" w-1/2 text-[10px] ">
      <p className="pb-0 text-center">អ្នកប្រគល់: </p>
      <p className="pb-9 text-center">{invoice.seller?.title}</p>
    </div>
    <div className=" w-1/2 text-[10px]  " >
      <p className="pb-0   text-center">អ្នកទទួល: </p>
      <p className="pb-9  whitespace-nowrap text-center ">
        {invoice.customer?.title}
      </p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p className="text-[4px] py-7">.</p>
    </div>
  </div>

</div>

      </div>
    </div>
  );
};

export default InvoiceDetail;
