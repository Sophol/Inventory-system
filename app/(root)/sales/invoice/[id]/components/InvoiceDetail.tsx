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
  console.log("invoice", invoice);
  if (!success) return notFound();
  if (!setting) return notFound();
  return (
    <div className="card80 ">
      <div className="printable-area card80-container">
        <div className="sm:flex flex-row justify-between  p-2 invoice-header">
          <div className="flex flex-col logo">
            <Image
              src={`/` + setting.companyLogo}
              alt="Company Logo"
              width={200}
              height={100}
              className="h-8 w-auto object-contain sm:mx-auto sm:w-full"
            />
            <p className="text-sm pt-4 pb-0">{setting.companyName}</p>
            <p className="text-sm ">
              {setting.address}, {setting.phone}
            </p>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg"># {invoice.referenceNo}</h1>
            <br />
            <p className="text-sm">
              Date Issued: {format(invoice.invoicedDate, "PPP")}
            </p>
            <p className="text-sm">
              Due Date:
              {invoice.dueDate ? format(invoice.dueDate, "PPP") : "N/A"}
            </p>
          </div>
        </div>
        <br />
        <div className="md:flex p-2 invoice-body mb-5">
          <div className="flex gap-4 invoice-to">
            <p className="pb-1 w-1/3">Invoice To: </p>
            <p className="pb-1 w-2/3">
              <span className="sub-info">{invoice.customer.title}</span>
            </p>
          </div>
          <div className="bill-to">
            {/* <p className=" text-lg">Bill To:</p> */}
            <div className="sub-info">
              <div className="flex gap-4">
                <p className="pb-1 w-1/3">Total Due: </p>
                <p className="pb-1 w-2/3">
                  {invoice.balance ? formatCurrency(invoice.balance) : 0.0}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="pb-1 w-1/3">Paid By: </p>
                <p className="pb-1 w-2/3">
                  {invoice.paid === 0 ? "N/A" : invoice.paidBy}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="sale-details bg-white rounded-lg shadow-sm">
          <div className="flex gap-4 border-b pb-4 px-7  ">
            <p className="w-2/6">ITEM</p>
            <p className="w-2/6">PRICE</p>
            <p className="w-1/6">QTY</p>
            <p className="w-1/6">TOTAL</p>
          </div>
          {invoice.saleDetails.map((detail, index) => (
            <div
              key={index}
              className="flex gap-4 border-b py-3 last:border-b-0 px-7"
            >
              <p className="w-2/6">{detail.selectedProduct?.title}</p>
              <p className="w-2/6">
                {detail.price !== undefined
                  ? formatCurrency(detail.price)
                  : "N/A"}
              </p>
              <p className="w-1/6">
                {detail.qty}{" "}
                {detail.selectedUnit ? detail.selectedUnit.title : "N/A"}
              </p>
              <p className="w-1/6">
                {detail.price !== undefined && detail.qty !== undefined
                  ? formatCurrency(detail.price * detail.qty)
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-4 invoice-body">
          <div className="pt-3 invoice-note">
            <p>
              Salesperson:{" "}
              <span className="sub-info">{invoice.sellerName} </span>
            </p>
            <p className="sub-info">Thanks for your bussiness</p>
          </div>
          <div className="pt-3 invoice-total">
            <br />
            <div className="sub-info">
              <div className="flex gap-4">
                <p className="sub-info pb-1 w-1/3">Subtotal:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {" "}
                  {invoice.subtotal ? formatCurrency(invoice.subtotal) : "N/A"}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="pb-1 w-1/3 ">Discount: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.discount ? formatCurrency(invoice.discount) : "N/A"}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="pb-1 w-1/3">Delivery: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.delivery ? invoice.delivery : "N/A"}
                </p>
              </div>
              <hr className="border-t-2 border-gray-400 my-3" />
              <div className="flex gap-4">
                <p className="pb-1 w-1/3">Total: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.grandtotal
                    ? formatCurrency(invoice.grandtotal)
                    : "N/A"}
                </p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
