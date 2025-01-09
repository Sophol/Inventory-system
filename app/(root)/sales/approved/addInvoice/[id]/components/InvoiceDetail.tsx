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
        <div className="flex flex-row justify-between  p-2 invoice-header">
          <div className="flex flex-col">
            <Image
              src={`/` + setting.companyLogo}
              alt="Company Logo"
              width={200}
              height={100}
              className="h-8 w-auto object-contain"
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
            <div className="flex flex-row space-x-1 items-center text-sm">
              <span>Due Date: </span>
              <span>
                <DatePicker
                  initialDate={new Date()}
                  onDateChange={handleChangeDate}
                />
              </span>
            </div>
          </div>
        </div>
        <br />
        <div className="flex gap-4 p-2 invoice-body mb-5">
          <div className="w-1/2 ">
            <p className="pb-3">Invoice To:</p>
            <p className="sub-info">{invoice.customer.title}</p>
          </div>
          <div className="w-1/2">
            <h1 className=" text-lg mb-2">Bill To:</h1>
            <div className="sub-info">
              <div className="flex gap-4">
                <p className="pb-1 w-1/3">Total Due: </p>
                <p className="pb-1 w-2/3">
                  {invoice.balance ? formatCurrency(invoice.balance) : "N/A"}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="pb-1 w-1/3">Paid By: </p>
                <p className="pb-1 w-2/3">
                  {invoice.balance ? formatCurrency(invoice.balance) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="sale-details bg-white rounded-lg shadow-sm">
          <div className="flex gap-4 border-b pb-4 px-7  ">
            <p className="w-2/6">ITEM</p>
            <p className="w-2/6">COST</p>
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
                  {invoice.balance ? formatCurrency(invoice.balance) : "N/A"}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="pb-1 w-1/3 ">Discount: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.discount ? formatCurrency(invoice.discount) : "N/A"}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="pb-1 w-1/3">Tax: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {invoice.tax ? invoice.tax : "N/A"}
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
