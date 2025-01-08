"use client";
import { useState } from "react";
import InvoiceDetail from "./InvoiceDetail";
import InvoiceAction from "./InvoiceAction";

const Invoice = ({ invoice, setting }: { invoice: Sale; setting: Setting }) => {
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const handleDueDateChange = (date: Date) => {
    setDueDate(date);
  };

  return (
    <div className="flex gap-4 p-7">
      <InvoiceDetail
        invoice={invoice}
        onDueDateChange={handleDueDateChange}
        setting={setting}
      />
      <InvoiceAction invoice={invoice} dueDate={dueDate} />
    </div>
  );
};

export default Invoice;
