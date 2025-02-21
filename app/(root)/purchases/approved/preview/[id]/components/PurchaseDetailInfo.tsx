"use client";
import "../invoice.css";
import { format } from "date-fns";
import Currency from "@/components/Currency";

const PurchaseDetailInfo = ({ purchase }: { purchase: Purchase }) => {
  console.log(purchase);
  return (
    <div className="card80 ">
      <div className="printable-area">
        <div className="sm:flex flex-row justify-between invoice-header">
          <div className="flex flex-col">
            <h1
              className={`font-bold text-lg sm:pt-0 pt-5 mx-auto sm:mx-0`}
            >
              # {purchase.referenceNo}
            </h1>

            <p className="text-sm">
              <span className="pr-2">ថ្ងៃចេញ:</span>
              {format(new Date(purchase.purchaseDate), "dd/MM/yyyy hh:mm:ss ")}
            </p>
          </div>
        </div>

        <div className="flex p-2 invoice-body mt-2 mb-1 flex-wrap md:flex-nowrap">
  <div className="bill-to w-full md:w-auto">
    <div className="flex gap-2 flex-nowrap w-full">
      <p className="pb-1">អ្នកផ្គត់ផ្គង់: </p>
      <p className="pb-1 font-bold">{purchase.supplier.title}</p>
    </div>
    <div className="flex gap-2 flex-nowrap w-full">
      <p className="pb-1 whitespace-nowrap">លេខទូរស័ព្ទអ្នកផ្គត់ផ្គង់: </p>
      <p className="pb-1 font-bold whitespace-nowrap">{purchase.supplier.phone}</p>
    </div>
    <div className="flex gap-2 flex-nowrap w-full">
      <p className="pb-1">សាខា : </p>
      <p className="pb-1 font-bold">{purchase.branch.title}</p>
    </div>
  </div>
  <div className="sub-info w-full md:w-auto">
    <div className="flex gap-2 flex-nowrap w-full">
      <p className="pb-1">សរុបចំនួន: </p>
      <p className="pb-1 font-bold">
        <Currency amount={purchase.grandtotal} />
      </p>
    </div>
    <div className="flex gap-2 flex-nowrap w-full">
      <p className="pb-1">បង់ប្រាក់ដោយ: </p>
      <p className="pb-1 font-bold">{purchase.paidBy}</p>
    </div>
  </div>
</div>

        <div className="sale-details bg-white rounded-lg shadow-sm">
          <div className="flex gap-2 border-b pb-1 px-2 text-sm  ">
            <p className="w-2/6 font-bold whitespace-nowrap">ទំនិញ</p>
            <p className="w-2/6 font-bold whitespace-nowrap">ថ្លៃ</p>
            <p className="w-1/6 font-bold whitespace-nowrap">ចំនួន</p>
            <p className="w-1/6 font-bold whitespace-nowrap">សរុប</p>
          </div>
          {purchase.purchaseDetails.map((detail, index) => (
            <div
              key={index}
              className="flex gap-2 border py-1 last:border-b-0 px-2 text-sm "
            >
              <p className="w-2/6 font-bold ">{detail.selectedProduct?.title}</p>
              <p className="w-2/6 font-bold" suppressHydrationWarning>
                {detail.cost !== undefined ? (
                  <Currency amount={detail.cost} />
                ) : (
                  "N/A"
                )}
              </p>
              <p className="w-1/6 font-bold">
                {detail.qty}{" "}
                {detail.selectedUnit ? detail.selectedUnit.title : "N/A"}
              </p>
              <p className="w-1/6 font-bold">
                {detail.cost !== undefined && detail.qty !== undefined ? (
                  <Currency amount={detail.cost * detail.qty} />
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 invoice-body font-bold">
          <div className="pt-3 invoice-note "></div>
          <div className="pt-3 invoice-total">
            <br />
            <div className="sub-info">
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap">ថ្លៃទំនិញ:</p>
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
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap" >ថ្លៃដឹកចូល:</p>
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
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap">ថ្លៃដឹកចេញ:</p>
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
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap">ថ្លៃសេវា:</p>
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
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap">ថ្លៃដឹក:</p>
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
                <p className="pb-1 w-1/3">សរុប: </p>
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
