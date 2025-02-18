"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { UserSchema } from "@/lib/validations";

import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { api } from "@/lib/api";
import FormSelect from "../formInputs/FormSelect";
import { rolesData } from "@/constants/data";
import FormCheckBox from "../formInputs/FormCheckBox";
import { getBranches } from "@/lib/actions/branch.action";
import FormCombobox from "../formInputs/FormCombobox";
import { useTranslations } from "next-intl";

interface Params {
  user?: User;
  isEdit?: boolean;
}

const UserForm = ({ user, isEdit = false }: Params) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      password: user?.password || "",
      role:
        (user?.role as
          | "stock"
          | "seller"
          | "admin"
          | "report"
          | "branch"
          | "user"
          | "auditReport") || "admin",
      image: user?.image || "",
      phone: user?.phone || "",
      isStaff: user?.isStaff || false,
      branch: user?.branch?._id || "",
      salary: user?.salary || 0,
    },
  });
  const handleCreateUser = async (data: z.infer<typeof UserSchema>) => {
    startTransaction(async () => {
      if (isEdit && user) {
        const result = await api.users.update(user?._id, data);
        if (result.success) {
          toast({
            title: "success",
            description: "User updated successfully.",
          });
          if (result.data) router.push(ROUTES.USERS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await api.users.create(data);
      if (result.success) {
        toast({
          title: "success",
          description: "User created successfully.",
        });
        if (result.data) router.push(ROUTES.USERS);
      } else {
        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  };
  const fetchBranches = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getBranches({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
    });
    if (success) {
      return { data: data?.branches || [], isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleCreateUser)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            name="username"
            label={t("username")}
            control={form.control}
          />
          <FormInput name="name" label={t("name")} control={form.control} />
          <FormInput
            name="email"
            type="email"
            label={t("email")}
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormSelect
            name="role"
            label={t("role")}
            control={form.control}
            items={rolesData}
          />
          <FormInput
            name="password"
            label={t("password")}
            type="password"
            control={form.control}
          />
          <FormInput
            name="phone"
            label={t("phone")}
            isRequired={false}
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormCheckBox
            name="isStaff"
            label={t("isStaff")}
            control={form.control}
          />
          <FormCombobox
            control={form.control}
            name="branch"
            label={t("branch")}
            // placeholder="Select Branch"
            fetchSingleItem={user ? user.branch : null}
            fetchData={fetchBranches}
            setValue={form.setValue} // Replace with actual branch data
          />
          <FormInput
            name="salary"
            label={t("salary")}
            type="number"
            control={form.control}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient w-fit uppercase !text-light-900"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>{isEdit ? t("update") : t("save")}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
