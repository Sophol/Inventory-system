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
    accessorKey: "salaryDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => format(new Date(row.original.salaryDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "staffId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="staffId" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <span>{user.staffId.username}</span>;
    },
  },
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="branch" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <span>{user.branch.title}</span>;
    },
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="salary" />
    ),
  },
  {
    accessorKey: "allowance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="allowance" />
    ),
  },
  {
    accessorKey: "deduction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="deduction" />
    ),
  },
  {
    accessorKey: "netSalary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Salary" />
    ),
  },
  {
    id: "actions",
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
        <div className="flex items-center space-x-1">
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
