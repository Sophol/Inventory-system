
"use client";
import React from 'react';

import "../invoice.css";


import * as fa from 'react-icons/fa';


import PaymentDrawer from '@/components/drawers/PaymentDrawer';
import { Button } from "@/components/ui/button";
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

const InvoiceAction: React.FC<params> = ({ invoice }) => {
  return (
    <div className="card20">
      <div className="card20-container">
        <Button type="submit"
          className="button-download-invoice w-full rounded px-4 py-2 text-white hover:bg-purple-700">
          <span>Download</span>
        </Button>
        <div className='flex gap-4 my-5'>
          <Button className='w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500 '>Print</Button>
          <Button className='w-1/2 rounded bg-light-400 px-4 py-2 text-white hover:bg-light-500 '> Edit</Button>
        </div>

        <PaymentDrawer sale={invoice}/>
      </div>
    </div>
  );
};

export default InvoiceAction;