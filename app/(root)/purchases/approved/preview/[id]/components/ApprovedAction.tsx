import React from "react";
import "../invoice.css";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { useRouter } from "next/navigation";
import { FaPrint } from "react-icons/fa";

const PurchaseAction = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push(ROUTES.PURCHASECOMPLETES);
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
        <div className="flex gap-2 my-1">
          <Button
            onClick={handlePrintWithoutLogo}
            className="w-2/3 rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          >
            <FaPrint className="cursor-pointer text-xl" /> Print
          </Button>
          <Button
            onClick={handleBack}
            className="w-1/3 rounded bg-light-400 px-4 py-2 text-sm text-white hover:bg-light-500"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseAction;
