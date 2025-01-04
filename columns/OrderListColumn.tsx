"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit, FaFileInvoice } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import ButtonApproveOrder from "@/components/formInputs/ButtonApproveOrder";

import { deleteSale, updateOrderStatus } from "@/lib/actions/sale.action";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";


export type Sale = {
  _id: string;
  referenceNo: string;
  customer: { _id: string; name: string };
  branch: { _id: string; title: string };
  saleDate: string;
  orderStatus: string;
  paymentStatus: string;
};

const reloadPage = () => {
  window.location.reload();
};

export const SaleColumn: ColumnDef<Sale, SaleTableMeta>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference No" />
    ),
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
    accessorKey: "subtotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Total" />
    ),
  },
  {
    accessorKey: "grandtotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grand Total" />
    ),
  },
  {
    accessorKey: "orderDate", // Assuming saleDate is the date field you want to format
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("orderDate") as string;
      const formattedDate = format(new Date(date), "dd/MM/yyyy hh:mm:ss " ); // Customize format as needed
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return (
        <Badge
          className={status === "completed" ? "bg-green-500 uppercase" : status === "approved" ? "bg-blue-500 uppercase" : status === "pending" ? "bg-yellow-500 uppercase" : "bg-red-500 uppercase"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const sale = row.original;
      const handleApproveOrder = async () => {
        const { success } = await updateOrderStatus({ saleId: sale._id });
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
      const handleDelete = async () => {
        const { success } = await deleteSale({ saleId: sale._id });
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
        <div className="flex items-center space-x-1">
          <div>
            {sale.orderStatus === 'pending' ? (
            // Display the "above" content
              <ButtonApproveOrder onPopup={handleApproveOrder} /> 
            ) : (
              // Display the "below" content
              <RedirectButton
              Icon={FaFileInvoice}
              href={ROUTES.INVOICE(sale._id)}
              isIcon
              className="text-blue-500"
            />
            )}
        </div>
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.SALE(sale._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
          
         
        </div>
      );
    },
  }
  
];
