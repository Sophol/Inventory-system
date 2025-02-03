"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { CreateProductSchema } from "@/lib/validations";
import { createProduct, editProduct } from "@/lib/actions/product.action";
import { getCategories } from "@/lib/actions/category.action";
import { getUnits } from "@/lib/actions/unit.action";
import { dataStatuses } from "@/constants/data";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";

import { Form } from "../ui/form";
import { Button } from "../ui/button";
import FormCombobox from "../formInputs/FormCombobox";
import FormInput from "../formInputs/FormInput";
import FormSelect from "../formInputs/FormSelect";
import FormUnitVariant from "../formInputs/FormUnitVariant";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Params {
  product?: Product;
  isEdit?: boolean;
}

const ProductForm = ({ product, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      title: product?.title || "",
      status: product?.status || "active",
      code: product?.code || "",
      description: product?.description || "",
      image: product?.image || "",
      units: product?.units || [
        { unit: "", qty: 0, cost: 0, price: 0, wholeSalePrice: 0, level: 1 },
      ],
      category: product?.category || "",
      qtyOnHand: product?.qtyOnHand || 0,
      alertQty: product?.alertQty || 0,
    },
  });

  const selectedData = product
    ? { _id: product.category, title: product.categoryTitle }
    : null;
  const statusData: SelectData[] = dataStatuses;

  const fetchCategories = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getCategories({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
    });
    if (success) {
      return { data: data?.categories || [], isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };

  const fetchUnits = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getUnits({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
    });
    if (success) {
      return { data: data?.units || [], isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };

  const handleCreateProduct = async (
    data: z.infer<typeof CreateProductSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && product) {
        const result = await editProduct({
          productId: product?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Product updated successfully.",
          });
          if (result.data) router.push(ROUTES.PRODUCTS);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createProduct(data);
      if (result.success) {
        toast({
          title: "success",
          description: "Product created successfully.",
        });
        if (result.data) router.push(ROUTES.PRODUCTS);
      } else {
        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong!",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleCreateProduct)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput name="code" label="Code" control={form.control} />
          <FormCombobox
            control={form.control}
            name="category"
            label="Category"
            // placeholder="Select category"
            fetchSingleItem={selectedData}
            fetchData={fetchCategories}
            setValue={form.setValue}
          />
          <FormInput name="title" label="Title" control={form.control} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            type="number"
            name="alertQty"
            label="Alert Qty"
            control={form.control}
          />
          <FormSelect
            name="status"
            label="Status"
            control={form.control}
            items={statusData}
          />
        </div>
        <div className="flex">
          <Card>
            <CardHeader>
              <CardTitle>Product Unit Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="container mx-auto py-4">
                <FormUnitVariant
                  name="units"
                  control={form.control}
                  setValue={form.setValue}
                  fetchUnits={fetchUnits}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient w-fit !text-light-900 uppercase"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>{isEdit ? "Update" : "Submit"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
