import jsPDF from "jspdf";
import React from "react";
import "../invoice.css";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import ROUTES from "@/constants/routes";
import { approvedInvoice } from "@/lib/actions/invoice.action";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { FaCloudDownloadAlt, FaPrint, FaEdit } from "react-icons/fa";


const InvoiceAction = ({
  invoice,
  dueDate,
}: {
  invoice: Sale;
  dueDate: Date;
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(ROUTES.INVOICES);
  };
  const handleEdit = (invoiceId: string) => {
    router.push(ROUTES.APPROVEDSALE(invoiceId));
  };
  const handleAddInvoice = (dueDate: Date, invoiceId: string) => async () => {
    const {
      data: invoice,
      success,
      error,
    } = await approvedInvoice({
      saleId: invoiceId,
      dueDate,
    });
    if (success) {
      toast({
        title: "success",
        description: "Add to Invoice successfully.",
      });
      if (invoice) router.push(ROUTES.INVOICE(invoice._id));
    } else {
      toast({
        title: `Error ${error?.message || ""}`,
        description: error?.message || "Something went wrong!",
        variant: "destructive",
      });
    }
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
        <div className="flex gap-2">
          <Button
            onClick={invoice.isLogo == "true" ? handleDownloadWithLogo : handleDownloadWithoutLogo}
            className="w-1/2 rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500"
          >
            <FaCloudDownloadAlt className="cursor-pointer text-xl" /> Download
          </Button>
          <Button
            onClick={invoice.isLogo == "true" ? handlePrintWithLogo : handlePrintWithoutLogo}
            className="w-1/2 rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          >
            <FaPrint className="cursor-pointer text-xl" /> Print
          </Button>
        </div>

        <div className="flex gap-2 my-1">
          <Button
            onClick={() => handleEdit(invoice._id)}
            className="w-2/3 rounded bg-blue-400 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
         <FaEdit className="cursor-pointer text-xl" />    Edit 
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
          onClick={handleAddInvoice(dueDate, invoice._id)}
          className="bg-green-500 hover:bg-green-600 w-full rounded px-4 py-2 text-white"
        >
          <span>Add Invoice</span>
        </Button>
      </div>
    </div>
  );
};

export default InvoiceAction;
