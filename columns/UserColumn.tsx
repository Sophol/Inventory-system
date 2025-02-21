"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaRegEdit } from "react-icons/fa";

import RedirectButton from "@/components/formInputs/RedirectButton";
import ROUTES from "@/constants/routes";

import { DataTableColumnHeader } from "../components/table/DataTableColumnHeader";
import { deleteUser } from "@/lib/actions/user.action";
import { toast } from "@/hooks/use-toast";
import ButtonDelete from "@/components/formInputs/ButtonDelete";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
}

export const UserColumn: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      const username = row.getValue("username") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-1">{username}</span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-1">{name}</span>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-1">{email}</span>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-1">{role}</span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <span className="flex justify-center whitespace-nowrap px-1">{phone}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const handleDelete = async () => {
        // Add your delete logic here
        const { success, error } = await deleteUser({
          userId: user._id,
        });
        if (success) {
          toast({
            title: "success",
            description: "User deleted successfully.",
          });
          window.location.reload();
        } else {
          toast({
            title: "error",
            description: error?.message || "Something went wrong.",
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex items-center space-x-1 whitespace-nowrap justify-center">
          <RedirectButton
            Icon={FaRegEdit}
            href={ROUTES.USER(user._id)}
            isIcon
            className="text-primary-500"
          />
          <ButtonDelete onDelete={handleDelete} />
        </div>
      );
    },
  },
];
