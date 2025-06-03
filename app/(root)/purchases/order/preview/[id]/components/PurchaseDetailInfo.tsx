"use client";
import "../invoice.css";
import { format } from "date-fns";
import Currency from "@/components/Currency";

const PurchaseDetailInfo = ({ purchase }: { purchase: Purchase }) => {
  return (
    <div className="card80 ">
      <div className="printable-area">
        <div className="sm:flex flex-row justify-between invoice-header">
          <div className="flex flex-col">
            <h1
              className={`font-bold text-lg pb-3 sm:pt-0 pt-5 mx-auto sm:mx-0`}
            >
              # {purchase.referenceNo}
            </h1>

            <p className="text-sm">
              <span className="pr-2">Date Issued:</span>
              {format(new Date(purchase.purchaseDate), "dd/MM/yyyy hh:mm:ss ")}
            </p>
          </div>
        </div>

        <div className="flex p-2 invoice-body mt-2 mb-1">
          <div className="bill-to">
            <div className="flex gap-2">
              <p className="pb-1">Supplier: </p>
              <p className="pb-1">{purchase.supplier.title}</p>
            </div>
            <div className="flex gap-2">
              <p className="pb-1">Branch: </p>
              <p className="pb-1">{purchase.branch.title}</p>
            </div>
          </div>
          <div className="sub-info">
            <div className="flex gap-2">
              <p className="pb-1">Total Amount: </p>
              <p className="pb-1">
                <Currency amount={purchase.grandtotal} />
              </p>
            </div>
            <div className="flex gap-2">
              <p className="pb-1">Paid By: </p>
              <p className="pb-1">{purchase.paidBy}</p>
            </div>
          </div>
        </div>
        <div className="sale-details bg-white rounded-lg shadow-sm">
          <div className="flex gap-2 border-b pb-1 px-7 text-sm  ">
            <p className="w-2/6">ITEM</p>
            <p className="w-2/6">COST</p>
            <p className="w-1/6">QTY</p>
            <p className="w-1/6">TOTAL</p>
          </div>
          {purchase.purchaseDetails.map((detail, index) => (
            <div
              key={index}
              className="flex gap-2 border-b py-1 last:border-b-0 px-7 text-sm"
            >
              <p className="w-2/6">{detail.selectedProduct?.title}</p>
              <p className="w-2/6" suppressHydrationWarning>
                {detail.cost !== undefined ? (
                  <Currency amount={detail.cost} />
                ) : (
                  "N/A"
                )}
              </p>
              <p className="w-1/6">
                {detail.qty}{" "}
                {detail.selectedUnit ? detail.selectedUnit.title : "N/A"}
              </p>
              <p className="w-1/6">
                {detail.cost !== undefined && detail.qty !== undefined ? (
                  <Currency amount={detail.cost * detail.qty} />
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 invoice-body">
          <div className="pt-3 invoice-note">
            <div className="flex flex-col">
              {purchase.description && (
                <span
                  className="text-[10px] mt-4 print:hidden block break-words"
                  style={{ width: "250px", wordWrap: "break-word", overflowWrap: "break-word" }}
                >
                  <span className="text-red-500 font-bold">Remarked:</span> {purchase.description}
                </span>
              )}
            </div>

          </div>
          <div className="pt-3 invoice-total">
            <br />
            <div className="sub-info">
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3">Subtotal:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {" "}
                  {purchase.subtotal ? (
                    <Currency amount={purchase.subtotal} />
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3">DeliveryIn:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {" "}
                  {purchase.deliveryIn ? (
                    <Currency amount={purchase.deliveryIn} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3">DeliveryOut:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {" "}
                  {purchase.deliveryOut ? (
                    <Currency amount={purchase.deliveryOut} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3">ServiceFee:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {" "}
                  {purchase.serviceFee ? (
                    <Currency amount={purchase.serviceFee} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3">ShippingFee:</p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {" "}
                  {purchase.shippingFee ? (
                    <Currency amount={purchase.shippingFee} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
              <hr className="border-t-2 border-gray-400 my-3" />
              <div className="flex gap-2">
                <p className="pb-1 w-1/3">Total: </p>
                <p className="pb-1 w-2/3 text-right font-bold">
                  {purchase.grandtotal ? (
                    <Currency amount={purchase.grandtotal} />
                  ) : (
                    "0.00"
                  )}
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

export default PurchaseDetailInfo;
