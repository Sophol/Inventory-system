"use client";
import PurchaseAction from "./ApprovedAction";
import PurchaseDetailInfo from "./PurchaseDetailInfo";

const PurchaseDetail = ({
  purchase,
  setting,
}: {
  purchase: Purchase;
  setting: Setting;
}) => {
  return (
    <div className="flex gap-4 invoice-container">
      <PurchaseDetailInfo purchase={purchase} setting={setting} />
      <PurchaseAction />
    </div>
  );
};

export default PurchaseDetail;
