"use client";
import React from "react";
import "../invoice.css";
import { format } from "date-fns";
import Currency from "@/components/Currency";
import Image from "next/image";

const PurchaseDetailInfo = ({
  purchase,
  setting,
}: {
  purchase: Purchase;
  setting: Setting;
}) => {
  return (
    <div className="card80 ">
      <div className="printable-area">
        <div className="sm:flex flex-row justify-between invoice-header">
          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-col justify-center logo">
            <Image
              src={`/` + setting.companyLogo}
              alt="Company Logo"
              width={100}
              height={100}
              className="w-auto sm:w-[100] h-20 object-contain text-center mx-auto"
            />
            <div className="flex flex-col">
              <p className="text-[12px] pt-0 pb-0 mx-auto sm:mx-0 font-bold text-center">
                {setting.companyName}
              </p>
              <p className="text-[12px] pb-0 mx-auto sm:mx-0 bold text-center">
                {setting.companyNameEnglish}
              </p>
              <p className="text-[9px] mx-auto sm:mx-0 address text-center">
                {setting.address}
              </p>
              <p className="text-[9px] mx-auto sm:mx-0 text-center">{setting.phone}</p>
            </div>
            </div>
            <h1 className={`font-bold text-[12px] sm:pt-0 pt-2 mx-auto sm:mx-0`}>
              # {purchase.referenceNo}
            </h1>

            <p className="text-[11px]">
              <span className="pr-2">ថ្ងៃចេញ:</span>
              {format(new Date(purchase.purchaseDate), "dd/MM/yyyy hh:mm:ss ")}
            </p>
          </div>
        </div>

        <div className="md:flex px-0 mb-0 mt-1 py-0 invoice-body">
          <div
            className="bill-to sub-info text-[11px] my-0 py-0"
            style={{ color: "black" }}
          >
            <div className="flex gap-2 flex-nowrap w-full">
              <p className="pb-1">អ្នកផ្គត់ផ្គង់: </p>
              <p className="pb-1">{purchase.supplier.title}</p>
            </div>
            <div className="flex gap-2 flex-nowrap w-full">
              <p className="pb-1 whitespace-nowrap">
                លេខទូរស័ព្ទអ្នកផ្គត់ផ្គង់:{" "}
              </p>
              <p className="pb-1 whitespace-nowrap">
                {purchase.supplier.phone}
              </p>
            </div>
            <div className="flex gap-2 flex-nowrap w-full">
              <p className="pb-1">សាខា : </p>
              <p className="pb-1 ">{purchase.branch.title}</p>
            </div>
          </div>
          <div className="sub-info  text-[11px] my-0 py-0">
            <div className="flex gap-2 flex-nowrap w-full">
              <p className="pb-1">សរុបចំនួន: </p>
              <p className="pb-1">
                <Currency amount={purchase.grandtotal} />
              </p>
            </div>
            <div className="flex gap-2 flex-nowrap w-full">
              <p className="pb-1">បង់ប្រាក់ដោយ: </p>
              <p className="pb-1 ">{purchase.paidBy}</p>
            </div>
          </div>
        </div>

        <div className="sale-details bg-white rounded-lg shadow-sm ">
          <div className="flex gap-2 border-b pb-1 px-2 text-[11px]    ">
            <p className="w-2/6 font-bold  pl-2 pr-1 data-for-print print-h1 ">
              ទំនិញ
            </p>
            <p className="w-1/6 font-bold px-1 data-for-print print-h2 ">
              ថ្លៃ
            </p>
            <p className="w-1/6 font-bold px-1 data-for-print print-h3">
              ចំនួន
            </p>
            <p className="w-2/6 font-bold pl-1 pr-2 data-for-print print-h4 text-center">
              សរុប
            </p>
          </div>
          {purchase.purchaseDetails.map((detail, index) => (
            <div
              key={index}
              className="flex gap-2 border-b pt-1 last:border-b-0 px-2 text-[11px]"
            >
              <p className="w-2/6 pl-1 pr-1 data-for-print print-d1 whitespace-nowrap">
                {detail.selectedProduct?.title}
              </p>
              <p
                className="w-1/6 px-1 data-for-print print-d2 whitespace-nowrap"
                suppressHydrationWarning
              >
                {detail.cost !== undefined ? (
                  <Currency amount={detail.cost} />
                ) : (
                  "N/A"
                )}
              </p>
              <p className="w-1/6 px-1 data-for-print print-d3 whitespace-nowrap">
                {detail.qty}{" "}
                {detail.selectedUnit ? detail.selectedUnit.title : "N/A"}
              </p>
              <p className="w-2/6 pl-1 mr-2 data-for-print print-d4 text-right">
                {detail.cost !== undefined && detail.qty !== undefined ? (
                  <Currency amount={detail.cost * detail.qty + 10000000} />
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 invoice-body font-bold pt-2 mt-0">
          <div className="pt-0 invoice-note text-left w-[100px] h-[130px] min-h-[130px]">
            <div className="flex flex-col telegramlogo ">
              <br />
              <Image
                src={`/images/company_telegram_qr.jpg`}
                alt="Company Telegram QR"
                width={100}
                height={100}
                className="w-[70] h-20 object-contain pt-1 grayscale ml-9 "
              />
              <span className="text-[10px] mt-0 ml-[49px] logo">Telegram</span>
              <br />
            </div>
          </div>
          <div className="pt-1 invoice-total">
            <div className="sub-info text-[11px]">
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap text-[11px]">
                  ថ្លៃទំនិញ:
                </p>
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
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap text-[11px]">
                  ថ្លៃដឹកចូល:
                </p>
                <p className="pb-1 w-2/3 text-right font-bold  text-[11px]">
                  {" "}
                  {purchase.deliveryIn ? (
                    <Currency amount={purchase.deliveryIn} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap">
                  ថ្លៃដឹកចេញ:
                </p>
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
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap  text-[11px]">
                  ថ្លៃសេវា:
                </p>
                <p className="pb-1 w-2/3 text-right font-bold  text-[11px]">
                  {" "}
                  {purchase.serviceFee ? (
                    <Currency amount={purchase.serviceFee} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="sub-info pb-1 w-1/3 whitespace-nowrap  text-[11px]">
                  ថ្លៃដឹក:
                </p>
                <p className="pb-1 w-2/3 text-right font-bold  text-[11px]">
                  {" "}
                  {purchase.shippingFee ? (
                    <Currency amount={purchase.shippingFee} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
              <hr className="border-t-2 border-gray-400 my-1" />
              <div className="flex gap-2  text-[11px]">
                <p className="pb-1 w-1/3">សរុប: </p>
                <p className="pb-1 w-2/3 text-right font-bold  text-[11px]">
                  {purchase.grandtotal ? (
                    <Currency amount={purchase.grandtotal} />
                  ) : (
                    "0.00"
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
        <div className="  " >
                <p className="pb-1 w-full text-[10px]  ">អ្នកទទួល: </p>
                <p className="pb-7 w-full text-[10px] whitespace-nowrap ">
                  {purchase.customer?.title}
                </p>
                <p></p>
                <p></p>
                <p></p>
                <p className="text-[4px] py-5">.</p>
              </div>
      </div>
    </div>
  );
};

export default PurchaseDetailInfo;
