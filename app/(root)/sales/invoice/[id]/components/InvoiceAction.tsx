"use client";

import jsPDF from "jspdf";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import "../invoice.css";
import { updateOrderStatus } from "@/lib/actions/sale.action";
import { getPayments } from "@/lib/actions/payment.action";
import { toast } from "@/hooks/use-toast";
import PaymentDrawer from "@/components/drawers/PaymentDrawer";
import { Button } from "@/components/ui/button";
import ButtonStatusOrder from "@/components/formInputs/ButtonStatusOrder";
import html2canvas from "html2canvas";
import PaymentHistory from "../payment/PaymentHistory";


interface params {
  invoice: {
    _id: string;
    customer: { _id: string; title: string };
    branch: { _id: string; title: string };
    referenceNo: string;
    description?: string;
    orderDate: string;
    approvedDate: string;
    dueDate: string;
    invoicedDate: string;
    discount: number;
    subtotal: number;
    grandtotal: number;
    paid: number;
    balance: number;
    exchangeRateD?: number;
    exchangeRateT?: number;
    tax: number;
    paidBy?: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
    orderStatus: "pending" | "approved" | "completed";
    paymentStatus: "pending" | "credit" | "completed";
    saleDetails: PurchaseDetail[];
  };
}

const reloadPage = () => {
  window.location.reload();
};

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

const InvoiceAction: React.FC<params> = ({ invoice }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [payments, setPayments] = useState<any>([]);

  const handleStatusOrder = async () => {
    const { success } = await updateOrderStatus({ saleId: invoice._id });
    if (success) {
      toast({
        title: "success",
        description: "Invoice status updated successfully.",
      });
      reloadPage();
    } else {
      toast({
        title: "error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleCallInvoice = async () => {
    const { data: payments } = await getPayments({ sale: invoice._id });
    if (payments) {
      setPayments(payments);
      setIsDialogOpen(true);
      // toast({
      //   title: "success",
      //   description: "Payments retrieved successfully.",
      // });
    } else {
      toast({
        title: "error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="card20">
      <div className="card20-container">
        <div className="flex gap-4">
          <ButtonStatusOrder
            onPopup={handleStatusOrder}
            btnTitle="Complete Order"
            disable={invoice.orderStatus === "completed"}
            description="Are you sure you want to complete this order?"
            classValue="w-2/3 button-download-invoice mb-4 rounded px-4 py-2 text-white hover:bg-purple-700"
          />
          <Button
            onClick={handleCallInvoice}
            className="w-1/3 rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
          >
            <FaHistory className="cursor-pointer text-xl" />
          </Button>
        </div>
        {isDialogOpen && (
          <PaymentHistory invoiceId={invoice._id} onClose={() => setIsDialogOpen(false)} />
        )}
        <Button
          type="button"
          onClick={handleDownload}
          className="bg-light-400 hover:bg-light-500 w-full rounded px-4 py-2 text-white"
        >
          <span>Download</span>
        </Button>
        <div className="flex gap-4 my-4">
          <Button
            onClick={handlePrint}
            className="w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500"
          >
            Print
          </Button>
          <Button className="w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500">
            Edit
          </Button>
        </div>
        <PaymentDrawer sale={invoice} />
      </div>
    </div>
  );
};

export default InvoiceAction;