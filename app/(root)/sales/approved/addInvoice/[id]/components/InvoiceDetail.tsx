"use client";
import "../invoice.css";
import Image from "next/image";
import DatePicker from "@/components/formInputs/DatePicker";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("km-KH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\./g, ","); // Replace dot with comma
};

const InvoiceDetail = ({
  invoice,
  onDueDateChange,
  setting,
}: {
  invoice: Sale;
  onDueDateChange: (date: Date) => void;
  setting: Setting;
}) => {
  const handleChangeDate = (date: Date) => {
    onDueDateChange(date);
  };
  return (
    <div className="card80 ">
      <div className="printable-area">
        <div className="sm:flex flex-row justify-between invoice-header">
          {/* Conditionally render logo if invoice.isLogo is true */}
          {invoice.isLogo !== "false" && (
            <div className="flex flex-col logo">
              <Image
                src={`/` + setting.companyLogo}
                alt="Company Logo"
                width={100}
                height={100}
                className="w-auto sm:w-[100] h-20 object-contain"
              />
              <p className="text-sm pb-1 mx-auto sm:mx-0">
                {setting.companyName}
              </p>
              <p className="text-sm pb-1 mx-auto sm:mx-0">
                {setting.companyNameEnglish}
              </p>
              <p className="text-sm pb-1 mx-auto sm:mx-0">{setting.address}</p>
              <p className="text-sm mx-auto sm:mx-0">{setting.phone}</p>
            </div>
          )}
          <div className="flex flex-col">
            <h1
              className={`font-bold text-lg pb-3 ${
                invoice.isLogo !== "false" ? "pt-0" : "sm:pt-0 pt-5"
              } mx-auto sm:mx-0`}
            >
              # {invoice.referenceNo}
            </h1>

            <p className="text-sm">
              <span className="pr-2">Date Issued:</span>
              {invoice.dueDate
                ? format(new Date(invoice.invoicedDate), "dd/MM/yyyy hh:mm:ss ")
                : "N/A"}
            </p>
            <p className="text-sm">
              <span className="pr-2"> Due Date:</span>

              <span>
                <DatePicker
                  initialDate={new Date()}
                  onDateChange={handleChangeDate}
                />
              </span>
            </p>
            {invoice.isLogo !== "false" && (
              <Image
                src={`/images/company_telegram_qr.jpg`}
                alt="Company Telegram QR"
                width={100}
                height={100}
                className="w-auto sm:w-[100] h-20 object-contain mx-auto pt-2"
              />
            )}
          </div>
        </div>

        <div className="md:flex p-2 invoice-body mb-1">
          <div className="bill-to">
            {/* <p className=" text-lg">Bill To:</p> */}
            <div className="sub-info">
              <div className="flex gap-2">
                <p className="pb-1 w-1/3">Total Due: </p>
                <p className="pb-1 w-2/3">
                  {invoice.balance ? formatCurrency(invoice.balance) : 0.0}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="pb-1 w-1/3">Paid By: </p>
                <p className="pb-1 w-2/3">
                  {invoice.paid === 0 ? "N/A" : invoice.paidBy}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="sale-details bg-white rounded-lg shadow-sm">
          <div className="flex gap-2 border-b pb-1 px-7 text-sm  ">
            <p className="w-2/6">ITEM</p>
            <p className="w-2/6">PRICE</p>
            <p className="w-1/6">QTY</p>
            <p className="w-1/6">TOTAL</p>
          </div>
          {invoice.saleDetails.map((detail, index) => (
            <div
              key={index}
              className="flex gap-2 border-b py-1 last:border-b-0 px-7 text-sm"
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
        <div className="flex gap-2 invoice-body">
          <div className="pt-3 invoice-note"></div>
          <div className="pt-3 invoice-total">
            <br />
            <div className="sub-info">
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3">Subtotal:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {" "}
                  {invoice.subtotal ? formatCurrency(invoice.subtotal) : "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="pb-1 w-1/3 ">Discount: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.discount ? formatCurrency(invoice.discount) : "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="pb-1 w-1/3">Delivery: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.delivery ? invoice.delivery : "N/A"}
                </p>
              </div>
              <hr className="border-t-2 border-gray-400 my-3" />
              <div className="flex gap-2">
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
        <div className="flex p-2 invoice-body  ">
          <div className="invoice-to pt-10 text-center">
            <p className="pb-1 w-full">Sender(អ្នកប្រគល់): </p>
            <p className="pb-5 w-full">
              <span className="">{invoice.sellerName}</span>
            </p>
          </div>
          <div className="bill-to pt-10">
            <div className=" text-center">
              <p className="pb-1 w-full">Receiver(អ្នកទទួល): </p>
              <p className="pb-5 w-full">{invoice.customer.title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
