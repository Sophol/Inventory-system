"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { format } from "date-fns";
import ButtonDelete from "@/components/formInputs/ButtonDelete";
import { toast } from "@/hooks/use-toast";
import { deleteSalary } from "@/lib/actions/salary.action";
import { formatCurrency } from '@/lib/utils';
export interface Salary {
  _id: string;
  salaryDate: Date;
  staffId: { _id: string; username: string };
  branch: { _id: string; title: string };
  salary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
}

export const SalaryColumn: ColumnDef<Salary>[] = [
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="branch" className="whitespace-nowrap justify-center flex"/>
    ),
    cell: ({ row }) => {
      const branch = row.original.branch?.title as string;
      return (
        <span className="text-[9px] whitespace-nowrap justify-center flex ">{branch}</span>
      );
    },
  },
  {
    accessorKey: "salaryDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" className="whitespace-nowrap justify-center flex"/>
    ),
    cell: ({ row }) =>
   {
      const formattedDate = format(new Date(row.original.salaryDate), "yyyy-MM-dd hh:mm:ss ");
      return <span className="text-[10px] whitespace-nowrap justify-center flex">{formattedDate}</span>;
    }
  },
  {
    accessorKey: "staffId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="staffId" className="whitespace-nowrap justify-center flex" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <span className="text-[9px] whitespace-nowrap justify-center flex ">{user.staffId.username}</span>
    },
  },

  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="salary" className="flex `justify-center whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const salary = row.getValue("salary") as number;
      return <span className="flex justify-end whitespace-nowrap px-4">{formatCurrency(salary)}</span>;
    },
  },
  {
    accessorKey: "allowance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="allowance" className="justify-center whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const allowance = row.getValue("allowance") as number;
      return  <span className="flex justify-end whitespace-nowrap px-4">{formatCurrency(allowance)}</span>;
    },
  },
  {
    accessorKey: "deduction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="deduction" className="justify-center whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const deduction = row.getValue("deduction") as number;
      return  <span className="flex justify-end whitespace-nowrap px-4">{formatCurrency(deduction)}</span>;
    },
  },
  {
    accessorKey: "netSalary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Salary" className="justify-center  whitespace-nowrap"/>
    ),
    cell: ({ row }) => {
      const netSalary = row.getValue("netSalary") as number;
      return  <span className="flex justify-end text-right  whitespace-nowrap px-4">{formatCurrency(netSalary)}</span>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" className="uppercase justify-center flex  whitespace-nowrap" />
    ),
    cell: ({ row }) => {
      const salary = row.original;

      const handleDelete = async () => {
        // Add your delete logic here
        const { success } = await deleteSalary({ salaryId: salary._id });
        if (success) {
          toast({
            title: "success",
            description: "Salary deleted successfully.",
          });
          window.location.reload();
        } else {
          toast({
            title: "error",
            description: "Something went wrong.",
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex items-center space-x-1 pl-5">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.SALARYEXP(salary._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
