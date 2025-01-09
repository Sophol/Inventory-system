import jsPDF from "jspdf";
import React from "react";
import "../invoice.css";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import RedirectButton from "@/components/formInputs/RedirectButton";
import ROUTES from "@/constants/routes";
import { approvedInvoice } from "@/lib/actions/invoice.action";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

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

const InvoiceAction = ({
  invoice,
  dueDate,
}: {
  invoice: Sale;
  dueDate: Date;
}) => {
  const router = useRouter();
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
  return (
    <div className="card20">
      <div className="card20-container">
        <Button
          type="button"
          onClick={handleDownload}
          className="bg-light-400 hover:bg-light-500 w-full rounded px-4 py-2 text-white"
        >
          <span>Download</span>
        </Button>
        <div className="flex justify-between gap-4 my-4">
          <Button
            onClick={handlePrint}
            className="w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500"
          >
            Print
          </Button>

          <RedirectButton
            title="Edit"
            href={ROUTES.APPROVEDSALE(invoice._id)}
            className="rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500"
          />
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
