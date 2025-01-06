"use client";

import jsPDF from 'jspdf';
import React from 'react';

import { FaRegCheckCircle, FaHistory } from 'react-icons/fa';

import "../invoice.css";

import { updateOrderStatus } from "@/lib/actions/sale.action";
import { getPayments } from "@/lib/actions/payment.action";
import { toast } from "@/hooks/use-toast";

import PaymentDrawer from '@/components/drawers/PaymentDrawer';
import { Button } from "@/components/ui/button";
// eslint-disable-next-line import/order
import html2canvas from 'html2canvas';
interface params {
  invoice: {
    _id: string,
    referenceNo: string,
    invoicedDate: string,
    dueDate: string,
    customer: any,
    branch: any,
    paidBy: string,
    paid: number,
    discount: number,
    tax: number,
    grandtotal: number,
    orderStatus: string,
    saleDetails: Array<any>
  };
}
const reloadPage = () => {
  window.location.reload();
};
const handlePrint = () => {
  window.print();
};

const handleDownload = async () => {
  const input = document.querySelector('.printable-area') as HTMLElement;
  if (!input) return;

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  const padding = 10; 

  pdf.addImage(imgData, 'PNG', padding, padding, pdfWidth - 2 * padding, pdfHeight - 2 * padding);
  pdf.save('invoice.pdf');
};

const InvoiceAction: React.FC<params> = ({ invoice }) => {
  const handleInvoiceOrder = async () => {
    const { success } = await updateOrderStatus({ saleId: invoice._id });
    if (success) {
      toast({
        title: "success",
        description: "Order Status update successfully.",
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
    const { success } = await getPayments({ sale: invoice._id });
    if (success) {
      toast({
        title: "success",
        description: "Order Status update successfully.",
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
  return (
    <div className="card20">
      <div className="card20-container">  
        <div className='flex gap-4'>
        <Button type="button"
          disabled={invoice.orderStatus === 'completed'}
          onClick={handleInvoiceOrder}
          className="w-2/3 button-download-invoice mb-4 rounded px-4 py-2 text-white hover:bg-purple-700">
          <FaRegCheckCircle className="cursor-pointer text-xl"/> <span>Complete Order</span>
        </Button>
        <Button 
          onClick={handleCallInvoice}
          className='w-1/3 rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 '><FaHistory className="cursor-pointer text-xl"  /></Button>
        </div>
        <Button type="button"
          onClick={handleDownload}
          className="bg-light-400 hover:bg-light-500 w-full rounded px-4 py-2 text-white">
          <span>Download</span>
        </Button>
        <div className='flex gap-4 my-4'>
          <Button onClick={handlePrint} className='w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500 '>Print</Button>
          <Button className='w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500 '> Edit</Button>
        </div>
        <PaymentDrawer sale={invoice}/>
      </div>
    </div>
  );
};

export default InvoiceAction;