"use client";

import jsPDF from "jspdf";
import React, { useState } from "react";
import { FaCloudDownloadAlt, FaPrint, FaHistory } from "react-icons/fa";
import "../invoice.css";
import { getPayments } from "@/lib/actions/payment.action";
import { toast } from "@/hooks/use-toast";
import PaymentDrawer from "@/components/drawers/PaymentDrawer";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import PaymentHistory from "../payment/PaymentHistory";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const InvoiceAction = ({ invoice }: { invoice: Sale }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatedInvoice, setUpdatedInvoice] = useState(invoice);
  const router = useRouter();

  const handleCallInvoice = async () => {
    const { data: payments } = await getPayments({ sale: invoice._id });
    if (payments) {
      setIsDialogOpen(true);
    } else {
      toast({
        title: "error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    router.push(ROUTES.INVOICES);
  };

  const handleDrawerClose = (updatedSale: any) => {
    setUpdatedInvoice(updatedSale);
  };

  const handlePrintWithLogo = () => {
    const printableArea = document.querySelector(
      ".printable-area"
    ) as HTMLElement;
    const logo = document.querySelector(".logo") as HTMLElement;

    if (!printableArea) return;

    // Add a temporary class to show the logo during printing
    if (logo) logo.classList.add("show-logo");

    // Trigger the print dialog
    window.print();

    // After printing, remove the temporary class to hide the logo again
    if (logo) logo.classList.remove("show-logo");
  };

  const handlePrintWithoutLogo = () => {
    const logo = document.querySelector(".logo") as HTMLElement;
    if (logo) logo.style.display = "none"; // Hide logo
    window.print();
    if (logo) logo.style.display = "block"; // Restore logo after printing
  };

  const handleDownloadWithLogo = async () => {
    const input = document.querySelector(".printable-area") as HTMLElement;
    const logo = document.querySelector(".logo") as HTMLElement;

    if (!input) return;

    // Add a temporary class to show the logo
    if (logo) logo.classList.add("show-logo");

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const padding = 10;

    pdf.addImage(
      imgData,
      "PNG",
      padding,
      padding,
      pdfWidth - 2 * padding,
      pdfHeight - 2 * padding
    );
    pdf.save("invoice_with_logo.pdf");

    // Remove the temporary class
    if (logo) logo.classList.remove("show-logo");
  };

  const handleDownloadWithoutLogo = async () => {
    const input = document.querySelector(".printable-area") as HTMLElement;
    const logo = document.querySelector(".logo") as HTMLElement;

    if (!input) return;

    // Add a temporary class to hide the logo
    if (logo) logo.classList.add("hide-logo");

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const padding = 10;

    pdf.addImage(
      imgData,
      "PNG",
      padding,
      padding,
      pdfWidth - 2 * padding,
      pdfHeight - 2 * padding
    );
    pdf.save("invoice_without_logo.pdf");

    // Remove the temporary class
    if (logo) logo.classList.remove("hide-logo");
  };

  return (
    <div className="card20">
      <div className="card20-container flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleCallInvoice}
            // disabled={updatedInvoice.paymentStatus === "pending"}
            className="w-full rounded bg-blue-400 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
            <span>Payment History</span>
          </Button>

        </div>
        {isDialogOpen && (
          <PaymentHistory
            invoiceId={invoice._id}
            onClose={() => setIsDialogOpen(false)}
          />
        )}

        <div className="flex gap-2">
          {/* Direct download buttons */}
          <Button
            onClick={invoice.isLogo=="true" ? handleDownloadWithLogo : handleDownloadWithoutLogo}
            className="w-1/2 rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500"
          >
            <FaCloudDownloadAlt className="cursor-pointer text-xl" /> Download
          </Button>
          <Button
            onClick={handleBack}
            className="w-1/2 rounded bg-light-400 px-4 py-2 text-sm text-white hover:bg-light-500"
          >
            Back
          </Button>
        </div>

        <div className="flex gap-4">
        <Button
             onClick={invoice.isLogo=="true" ? handlePrintWithLogo : handlePrintWithoutLogo}
            className="w-full rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          >
            <FaPrint className="cursor-pointer text-xl" /> Print
          </Button>
        </div>

        <PaymentDrawer sale={invoice} onClose={handleDrawerClose} />
      </div>
    </div>
  );
};

export default InvoiceAction;
