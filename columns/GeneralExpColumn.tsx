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
      <DataTableColumnHeader column={column} title="Branch"  className="justify-center"/>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <span>{user.branch.title}</span>;
    },
  },
  {
    accessorKey: "generalDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date"  className="justify-center" />
    ),
    cell: ({ row }) =>
    {
    
    const formattedDate = format(new Date(row.original.generalDate), "yyyy-MM-dd hh:mm:ss ");
    return <span className="text-[10px] min-w-[120px] flex justify-center">{formattedDate}</span>;
  }
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" className="justify-center" />
    ),
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount"  className="justify-center" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <span className="flex justify-end text-right">{formatCurrency(amount)}</span>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" className="uppercase justify-center flex " />
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
        <div className="flex items-center space-x-1 pl-7">
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
