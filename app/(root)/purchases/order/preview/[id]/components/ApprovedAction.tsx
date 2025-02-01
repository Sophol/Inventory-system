import React from "react";
import "../invoice.css";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { FaPrint, FaEdit } from "react-icons/fa";
import { approvedPurchase } from "@/lib/actions/purchase.action";

const PurchaseAction = ({ purchase }: { purchase: Purchase }) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(ROUTES.PURCHASES);
  };
  const handleEdit = (purchaseId: string) => {
    router.push(ROUTES.PURCHASE(purchaseId));
  };
  const handleApprovedPurchase = (purchaseId: string) => async () => {
    const {
      data: purchase,
      success,
      error,
    } = await approvedPurchase({
      purchaseId,
    });
    if (success) {
      toast({
        title: "success",
        description: "Approved successfully.",
      });
      if (purchase) router.push(ROUTES.PURCHASECOMPLETES);
    } else {
      toast({
        title: `Error ${error?.message || ""}`,
        description: error?.message || "Something went wrong!",
        variant: "destructive",
      });
    }
  };
  const handlePrintWithoutLogo = () => {
    const logo = document.querySelector(".logo") as HTMLElement;
    if (logo) logo.style.display = "none"; // Hide logo
    window.print();
    if (logo) logo.style.display = "block"; // Restore logo after printing
  };

  return (
    <div className="card20">
      <div className="card20-container flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            onClick={handlePrintWithoutLogo}
            className="w-full rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          >
            <FaPrint className="cursor-pointer text-xl" /> Print
          </Button>
        </div>

        <div className="flex gap-2 my-1">
          <Button
            onClick={() => handleEdit(purchase._id)}
            className="w-2/3 rounded bg-blue-400 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
            <FaEdit className="cursor-pointer text-xl" /> Edit
          </Button>
          <Button
            onClick={handleBack}
            className="w-1/3 rounded bg-light-400 px-4 py-2 text-sm text-white hover:bg-light-500"
          >
            Back
          </Button>
        </div>
        <Button
          type="button"
          onClick={handleApprovedPurchase(purchase._id)}
          className="bg-green-500 hover:bg-green-600 w-full rounded px-4 py-2 text-white"
        >
          <span>Approve</span>
        </Button>
      </div>
    </div>
  );
};

export default PurchaseAction;
