"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { getBranches } from "@/lib/actions/branch.action";
import { createSale, editSale } from "@/lib/actions/sale.action";
import { CreateSaleSchema } from "@/lib/validations";

import FormCombobox from "../formInputs/FormCombobox";
import FormDatePicker from "../formInputs/FormDatePicker";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { getSuppliers } from "@/lib/actions/supplier.action";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormSaleDetail from "../formInputs/FormSaleDetail";
import { getProduct, getProducts } from "@/lib/actions/product.action";
import { getUnits } from "@/lib/actions/unit.action";

interface Params {
  sale?: Sale;
  isEdit?: boolean;
  exchangeRateD?: number;
  exchangeRateT?: number;
}

const SaleForm = ({
  sale,
  isEdit = false,
  exchangeRateD,
  exchangeRateT,
}: Params) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreateSaleSchema>>({
    resolver: zodResolver(CreateSaleSchema),
    defaultValues: {
      supplier: sale?.supplier._id || "",
      branch: sale?.branch._id || "",
      referenceNo: sale?.referenceNo || "",
      description: sale?.description || "",
      saleDate: sale?.saleDate
        ? new Date(sale.saleDate)
        : new Date(),
      discount: sale?.discount || 0,
      subtotal: sale?.subtotal || 0,
      grandtotal: sale?.grandtotal || 0,
      exchangeRateD: sale?.exchangeRateD || exchangeRateD || 0,
      exchangeRateT: sale?.exchangeRateT || exchangeRateT || 0,
      paid: sale?.paid || 0,
      balance: sale?.balance || 0,
      paidBy: sale?.paidBy || "Cash",
      orderStatus: sale?.orderStatus || "completed",
      paymentStatus: sale?.paymentStatus || "completed",
      saleDetails: sale?.saleDetails || [
        { product: "", unit: "", qty: 0, cost: 0, total: 0 },
      ],
    },
  });
  const handleCreateSale = async (
    data: z.infer<typeof CreateSaleSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && sale) {
        const result = await editSale({
          saleId: sale?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Sale updated successfully.",
          });
          if (result.data) router.push(ROUTES.PURCHASES);
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong!",
            variant: "destructive",
          });
        }
        return;
      }
      const result = await createSale(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Sale created successfully.",
        });
        if (result.data) router.push(ROUTES.PURCHASES);
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

  const fetchSuppliers = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getSuppliers({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
    });
    if (success) {
      const suppliers =
        data?.suppliers.map((supplier) => ({
          _id: supplier._id,
          title: supplier.name, // Assuming 'name' is the correct field for title
        })) || [];
      return { data: suppliers, isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };
  const fetchPrducts = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getProducts({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
    });
    if (success) {
      const products =
        data?.products.map((product) => ({
          _id: product._id,
          title: product.title,
        })) || [];
      return { data: products, isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };
  const fetchUnits = async ({
    page,
    query,
    parentId,
  }: {
    page: number;
    query: string;
    parentId?: string;
  }) => {
    if (parentId) {
      const { data: product, success } = await getProduct({
        productId: parentId,
      });

      if (!success) return notFound();
      const units =
        product?.units.map((unit) => ({
          _id: unit.unit,
          title: unit.unitTitle,
          cost: unit.cost || 0,
        })) || [];

      if (units.length > 0) {
        return { data: units || [], isNext: false };
      }
    } else {
      const { success, data } = await getUnits({
        page: Number(page) || 1,
        pageSize: 10,
        query: query || "",
      });
      const units =
        data?.units.map((unit) => ({
          _id: unit._id,
          title: unit.title,
          cost: 0,
        })) || [];
      if (units.length > 0 && success) {
        return { data: units || [], isNext: false };
      }
    }
    return { data: [], isNext: false };
  };

  const fetchProductDetails = async (productId: string) => {
    const { data: product, success } = await getProduct({
      productId,
    });

    if (!success || !product) {
      throw new Error("Failed to fetch product details");
    }

    const units =
      product?.units.map((unit) => ({
        _id: unit.unit,
        title: unit.unitTitle,
        cost: unit.cost || 0,
      })) || [];

    if (units.length > 0) {
      return { data: units || [], isNext: false };
    }
    return { data: [], isNext: false };
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleCreateSale)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            name="referenceNo"
            label="Reference No"
            control={form.control}
          />
          <FormCombobox
            control={form.control}
            name="supplier"
            label="Supplier"
            placeholder="Select Supplier"
            fetchSingleItem={sale ? sale.supplier : null}
            fetchData={fetchSuppliers}
            setValue={form.setValue} // Replace with actual supplier data
          />
          <FormCombobox
            control={form.control}
            name="branch"
            label="Branch"
            placeholder="Select Branch"
            fetchSingleItem={sale ? sale.branch : null}
            fetchData={fetchBranches}
            setValue={form.setValue} // Replace with actual branch data
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormDatePicker
            name="saleDate"
            label="Sale Date"
            control={form.control}
            defaultValue={new Date()}
          />
          <FormInput
            name="exchangeRateD"
            label="ExchangeRate Dollar"
            control={form.control}
          />
          <FormInput
            name="exchangeRateT"
            label="ExchangeRate Thai"
            control={form.control}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <FormInput
            name="description"
            label="Description"
            control={form.control}
            isRequired={false}
          />
        </div>
        <div className="grid grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="container mx-auto py-4">
                <FormSaleDetail
                  control={form.control}
                  setValue={form.setValue}
                  fetchProducts={fetchPrducts}
                  fetchUnits={fetchUnits}
                  fetchProductDetails={fetchProductDetails}
                />
              </div>
            </CardContent>
          </Card>
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
              <>{isEdit ? "Update" : "Submit"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SaleForm;