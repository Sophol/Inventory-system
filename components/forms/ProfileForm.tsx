"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "@/hooks/use-toast";
import { ProfileSchema } from "@/lib/validations";

import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/lib/actions/user.action";

interface Params {
  user?: User;
  isEdit?: boolean;
}

const ProfileForm = ({ user, isEdit = false }: Params) => {
  const t = useTranslations("erp");
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      userId: user?._id,
      name: user?.name || "",
      email: user?.email || "",
      password: user?.password || "",
      image: user?.image || "",
    },
  });
  const handleUpdateProfile = async (data: z.infer<typeof ProfileSchema>) => {
    startTransaction(async () => {
      if (isEdit && user) {
        const result = await updateProfile(data);
        if (result.success) {
          toast({
            title: "success",
            description: "User updated successfully.",
          });
          // if (result.data) router.push(ROUTES.USERS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
    });
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleUpdateProfile)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput name="name" label={t("name")} control={form.control} />
          <FormInput
            name="email"
            type="email"
            label={t("email")}
            control={form.control}
          />

          <FormInput
            name="password"
            label={t("password")}
            type="password"
            control={form.control}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
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

export default ProfileForm;
