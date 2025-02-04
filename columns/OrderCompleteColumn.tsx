"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaFileInvoice } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import ButtonDelete from "@/components/formInputs/ButtonDelete";

import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { voidInvoice } from "@/lib/actions/invoice.action";
import { formatCurrency } from '@/lib/utils';

const reloadPage = () => {
  window.location.reload();
};

export const SaleColumn: ColumnDef<Sale>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference No" />
    ),
    cell: ({ row }) => {
      const referenceNo = row.getValue("referenceNo") as string;
      return <span className="text-[10px]">{referenceNo}</span>;
    },
  },
  {
    accessorKey: "invoicedDate", // Assuming saleDate is the date field you want to format
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("invoicedDate") as string;
      const formattedDate = format(new Date(date), "yyyy-MM-dd hh:mm:ss ");
      return <span className="text-[10px] min-w-[120px] flex">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "branch.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
  },
  {
    accessorKey: "grandtotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grand Total" />
    ),
    cell: ({ row }) => {
      const grandtotal = row.getValue("grandtotal") as number;
      return <span>{formatCurrency(grandtotal)}</span>;
    },
  },

  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      const discount = row.getValue("discount") as number;
      return <span>{formatCurrency(discount)}</span>;
    },
  },
  {
    accessorKey: "delivery",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery" />
    ),
    cell: ({ row }) => {
      const delivery = row.getValue("delivery") as number;
      return <span>{formatCurrency(delivery)}</span>;
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      const paid = row.getValue("paid") as number;
      return <span>{formatCurrency(paid)}</span>;
    },
  },

  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number;
      return <span>{formatCurrency(balance)}</span>;
    },
  },

  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500 uppercase text-[10px] h-[23px] min-w-[85px] justify-center"
              : status === "approved"
                ? "bg-blue-500 uppercase text-[10px] h-[23px] min-w-[85px] justify-center"
                : status === "pending"
                  ? "bg-yellow-500 uppercase text-[10px] h-[23px] min-w-[85px] justify-center"
                  : "bg-red-500 uppercase text-[10px] h-[23px] min-w-[85px] justify-center"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" className="uppercase" />
    ),
    cell: ({ row }) => {
      const sale = row.original;
      const handleDelete = async () => {
        const { success } = await voidInvoice({ saleId: sale._id });
        if (success) {
          toast({
            title: "success",
            description: "Sale deleted successfully.",
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
        <div className="flex items-center ">
          <div>
            <RedirectButton
              Icon={FaFileInvoice}
              href={ROUTES.INVOICE(sale._id)}
              isIcon
              className="text-blue-500"
            />
          </div>
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
