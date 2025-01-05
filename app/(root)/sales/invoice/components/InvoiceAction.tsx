
"use client";

import jsPDF from 'jspdf';
import React from 'react';


import "../invoice.css";




import PaymentDrawer from '@/components/drawers/PaymentDrawer';
import { Button } from "@/components/ui/button";
// eslint-disable-next-line import/order
import html2canvas from 'html2canvas';
interface params {
  invoice: {
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
    saleDetails: Array<any>
  };
}
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

  const padding = 10; // Define the padding you want to add

  pdf.addImage(imgData, 'PNG', padding, padding, pdfWidth - 2 * padding, pdfHeight - 2 * padding);
  pdf.save('invoice.pdf');
};

const InvoiceAction: React.FC<params> = ({ invoice }) => {
  return (
    <div className="card20">
      <div className="card20-container">
        <Button type="button"
           onClick={handleDownload}
          className="button-download-invoice w-full rounded px-4 py-2 text-white hover:bg-purple-700">
          <span>Download</span>
        </Button>
        <div className='flex gap-4 my-5'>
          <Button    onClick={handlePrint} className='w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500 '>Print</Button>
          <Button className='w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500 '> Edit</Button>
        </div>

        <PaymentDrawer sale={invoice}/>
      </div>
    </div>
  );
};

export default InvoiceAction;