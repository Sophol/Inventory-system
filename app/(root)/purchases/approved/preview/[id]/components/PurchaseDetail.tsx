"use client";
import PurchaseAction from "./ApprovedAction";
import PurchaseDetailInfo from "./PurchaseDetailInfo";

const PurchaseDetail = ({ purchase }: { purchase: Purchase }) => {
  return (
    <div className="flex gap-4 invoice-container">
      <PurchaseDetailInfo purchase={purchase} />
      <PurchaseAction />
    </div>
  );
};

export default PurchaseDetail;
