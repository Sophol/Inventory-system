"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { format } from "date-fns";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { toast } from "@/hooks/use-toast";
import { deleteGeneralExp } from "@/lib/actions/generalExp.action";
import { formatCurrency } from '@/lib/utils';
export interface GeneralExp {
  _id: string;
  generalDate: Date;
  title: string;
  branch: { _id: string; title: string };
  amount: number;
  exchangeRateD: number;
  exchangeRateT: number;
  description: string;
}

export const GeneralExpColumn: ColumnDef<GeneralExp>[] = [
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch"  className="whitespace-nowrap flex justify-center"/>
    ),
    cell: ({ row }) => {
      const branch = row.original.branch?.title as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">{branch}</span>
      );
    },
  },
  {
    accessorKey: "generalDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date"  className="whitespace-nowrap flex justify-center" />
    ),
    cell: ({ row }) =>
    {
    
    const formattedDate = format(new Date(row.original.generalDate), "yyyy-MM-dd hh:mm:ss ");
    return <span className="text-[10px] whitespace-nowrap flex justify-center">{formattedDate}</span>;
  }
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" className="whitespace-nowrap flex justify-center" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="text-[9px] whitespace-nowrap ">{title}</span>
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount"  className="whitespace-nowrap flex justify-center" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <span className="flex justify-end text-right whitespace-nowrap px-4 " >{formatCurrency(amount)}</span>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" className="uppercase justify-center flex whitespace-nowrap " />
    ),
    cell: ({ row }) => {
      const generalExp = row.original;

      const handleDelete = async () => {
        const { success } = await deleteGeneralExp({
          generalExpId: generalExp._id,
        });
        if (success) {
          toast({
            title: "Success",
            description: "General expense deleted successfully.",
          });
          window.location.reload();
        } else {
          toast({
            title: "Error",
            description: "Something went wrong.",
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex items-center justify-center whitespace-nowrap ">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.GENERALEXP(generalExp._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
