"use client";

import jsPDF from "jspdf";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import "../invoice.css";
import { getPayments } from "@/lib/actions/payment.action";
import { toast } from "@/hooks/use-toast";
import PaymentDrawer from "@/components/drawers/PaymentDrawer";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import PaymentHistory from "../payment/PaymentHistory";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const handlePrint = () => {
  window.print();
};

const handleDownload = async () => {
  const input = document.querySelector(".printable-area") as HTMLElement;
  if (!input) return;

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
  pdf.save("invoice.pdf");
};

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
  const hadleBack = () => {
    router.push(ROUTES.INVOICES);
  };
  const handleDrawerClose = (updatedSale: any) => {
    console.log(updatedSale)
    setUpdatedInvoice(updatedSale)// Update the invoice state when the drawer closes
    console.log("invoice,", updatedInvoice)
  };
  return (
    <div className="card20">
      <div className="card20-container flex flex-col gap-2">
        <div className="flex">
          <Button
            onClick={handleCallInvoice}
            disabled={updatedInvoice.paymentStatus ==="pending"}
            className="w-full rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
          >
            <FaHistory className="cursor-pointer text-xl" />
            <span className="ml-2">Payment History</span>
          </Button>
        </div>
        {isDialogOpen && (
          <PaymentHistory
            invoiceId={invoice._id}
            onClose={() => setIsDialogOpen(false)}
          />
        )}
        <Button
          type="button"
          onClick={handleDownload}
          className="bg-light-400 hover:bg-light-500 w-full rounded px-4 py-2 text-white"
        >
          <span>Download</span>
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            className="w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500"
          >
            Print
          </Button>
          <Button
            onClick={hadleBack}
            className="w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500"
          >
            Back
          </Button>
        </div>
        <PaymentDrawer sale={invoice}  onClose={handleDrawerClose}/>
      </div>
    </div>
  );
};

export default InvoiceAction;
