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
import { formatCurrency } from "@/lib/utils";

const reloadPage = () => {
  window.location.reload();
};

export const SaleColumn: ColumnDef<Sale>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Reference No"
        className="justify-center min-w-[80px] w-[80px]"
      />
    ),
    cell: ({ row }) => {
      const referenceNo = row.getValue("referenceNo") as string;
      return (
        <span className="text-[9px]  min-w-[80px] w-[80px]">{referenceNo}</span>
      );
    },
  },
  {
    accessorKey: "invoicedDate", // Assuming saleDate is the date field you want to format
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue("invoicedDate") as string;
      const formattedDate = format(new Date(date), "yyyy-MM-dd hh:mm:ss ");
      return (
        <span className="text-[9px] min-w-[105px] flex justify-center">
          {formattedDate}
        </span>
      );
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
      <DataTableColumnHeader
        column={column}
        title="Branch"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const branch = row.original.branch.title as string;
      return (
        <span className="text-[9px] min-w-[100px] inline-flex">{branch}</span>
      );
    },
  },
  {
    accessorKey: "grandtotal",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Grand Total"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const grandtotal = row.getValue("grandtotal") as number;
      return (
        <span className="flex justify-end min-w-[90px] inline-flex w-full">
          {formatCurrency(grandtotal)}
        </span>
      );
    },
  },

  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Discount"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const discount = row.getValue("discount") as number;
      return (
        <span className="flex justify-end w-full">
          {formatCurrency(discount)}
        </span>
      );
    },
  },
  {
    accessorKey: "delivery",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Delivery"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const delivery = row.getValue("delivery") as number;
      return (
        <span className="flex justify-end w-full">
          {formatCurrency(delivery)}
        </span>
      );
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Paid"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const paid = row.getValue("paid") as number;
      return (
        <span className="flex justify-end  min-w-[100px] inline-flex w-full">
          {formatCurrency(paid)}
        </span>
      );
    },
  },

  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Balance"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number;
      return (
        <span className="flex justify-end min-w-[90px] inline-flex w-full">
          {formatCurrency(balance)}
        </span>
      );
    },
  },

  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Payment Status"
        className="justify-center flex"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
              : status === "approved"
                ? "bg-blue-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
                : status === "pending"
                  ? "bg-yellow-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
                  : "bg-red-500 uppercase text-[9px] h-[21px] min-w-[85px] w-[85px] flex justify-center pt-1 mx-auto"
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
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="uppercase justify-center flex"
      />
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
