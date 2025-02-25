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

  const handlePrintWithLogo = () => {
    window.print(); // Simply print the document with the logo visible
  };

  return (
    <div className="card20">
      <div className="card20-container flex flex-col gap-2">
        <div className="flex gap-2 my-1">
          <Button
            onClick={handlePrintWithoutLogo}
            className="w-1/2 rounded bg-green-400  text-white hover:bg-green-500  text-[12px]"
          >
            <FaPrint className="cursor-pointer text-[11px]" /> No Logo
          </Button>
          <Button
            onClick={handlePrintWithLogo}
            className="w-1/2 rounded bg-blue-400 text-white hover:bg-blue-500  text-[12px]"
          >
            <FaPrint className="cursor-pointer text-[11px]" /> With Logo
          </Button>

        </div>
        <Button
            onClick={handleBack}
            className="w-full rounded bg-light-400 px-4 py-2 text-sm text-white hover:bg-light-500"
          >
            Back
          </Button>
      </div>
    </div>
  );
};

export default PurchaseAction;
