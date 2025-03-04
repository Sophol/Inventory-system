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
import { createPurchase, editPurchase } from "@/lib/actions/purchase.action";
import { CreatePurchaseSchema } from "@/lib/validations";

import FormCombobox from "../formInputs/FormCombobox";
import FormDatePicker from "../formInputs/FormDatePicker";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { getSuppliers } from "@/lib/actions/supplier.action";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormPurchaseDetail from "../formInputs/FormPurchaseDetail";
import { getProduct, getProducts } from "@/lib/actions/product.action";
import { getUnits } from "@/lib/actions/unit.action";
import { generateUniqueReference } from "@/lib/utils";
import { getCustomers } from "@/lib/actions/customer.action";
import { useTranslations } from "next-intl";

interface Params {
  purchase?: Purchase;
  isEdit?: boolean;
  exchangeRateD?: number;
  exchangeRateT?: number;
}

const PurchaseForm = ({
  purchase,
  isEdit = false,
  exchangeRateD,
  exchangeRateT,
}: Params) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof CreatePurchaseSchema>>({
    resolver: zodResolver(CreatePurchaseSchema),
    defaultValues: {
      supplier: purchase?.supplier._id || "",
      branch: purchase?.branch._id || "",
      customer: purchase?.customer?._id || "",
      referenceNo:
        purchase?.referenceNo || generateUniqueReference({ prefix: "PO" }),
      description: purchase?.description || "",
      purchaseDate: purchase?.purchaseDate
        ? new Date(purchase.purchaseDate)
        : new Date(),
      discount: purchase?.discount || 0,
      subtotal: purchase?.subtotal || 0,
      grandtotal: purchase?.grandtotal || 0,
      deliveryIn: purchase?.deliveryIn || 0,
      deliveryOut: purchase?.deliveryOut || 0,
      shippingFee: purchase?.shippingFee || 0,
      serviceFee: purchase?.serviceFee || 0,
      exchangeRateD: purchase?.exchangeRateD || exchangeRateD || 0,
      exchangeRateT: purchase?.exchangeRateT || exchangeRateT || 0,
      paid: purchase?.paid || 0,
      balance: purchase?.balance || 0,
      paidBy: purchase?.paidBy || "Cash",
      orderStatus: purchase?.orderStatus || "pending",
      paymentStatus: purchase?.paymentStatus || "completed",
      purchaseDetails: purchase?.purchaseDetails || [
        { product: "", unit: "", qty: 0, cost: 0, total: 0 },
      ],
    },
  });
  const handleCreatePurchase = async (
    data: z.infer<typeof CreatePurchaseSchema>
  ) => {
    startTransaction(async () => {
      if (isEdit && purchase) {
        const result = await editPurchase({
          purchaseId: purchase?._id,
          ...data,
        });
        if (result.success) {
          toast({
            title: "success",
            description: "Purchase updated successfully.",
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
      const result = await createPurchase(data);

      if (result.success) {
        toast({
          title: "success",
          description: "Purchase created successfully.",
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
  const fetchCustomers = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
  }) => {
    const { success, data } = await getCustomers({
      page: Number(page) || 1,
      pageSize: 10,
      query: query || "",
      isDepo: true,
    });
    if (success) {
      const customers =
        data?.customers.map((customer) => ({
          _id: customer._id,
          title: customer.name, // Assuming 'name' is the correct field for title
        })) || [];
      return { data: customers, isNext: data?.isNext || false };
    }
    return { data: [], isNext: false };
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col  gap-2 text-sm"
        onSubmit={form.handleSubmit(handleCreatePurchase)}
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormInput
            name="referenceNo"
            label={t("referenceNo")}
            control={form.control}
          />
          <FormCombobox
            control={form.control}
            name="supplier"
            label={t("supplier")}
            // placeholder="Select Supplier"
            fetchSingleItem={purchase ? purchase.supplier : null}
            fetchData={fetchSuppliers}
            setValue={form.setValue} // Replace with actual supplier data
          />
          <FormCombobox
            control={form.control}
            name="branch"
            label={t("branch")}
            // placeholder="Select Branch"
            fetchSingleItem={purchase ? purchase.branch : null}
            fetchData={fetchBranches}
            setValue={form.setValue} // Replace with actual branch data
          />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormDatePicker
            name="purchaseDate"
            label={t("purchasedate")}
            control={form.control}
            defaultValue={new Date()}
          />
          <FormInput
            name="exchangeRateD"
            label={t("exchangeRateDollar")}
            control={form.control}
            type="number"
          />
          <FormInput
            name="exchangeRateT"
            label={t("exchangeRateBaht")}
            control={form.control}
            type="number"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-3">
          <FormCombobox
            control={form.control}
            name="customer"
            label={t("customer")}
            // placeholder="Select Branch"
            fetchSingleItem={
              purchase && purchase.customer ? purchase.customer : null
            }
            isRequired={false}
            fetchData={fetchCustomers}
            setValue={form.setValue} // Replace with actual branch data
          />
          <div className="col-span-2">
            <FormInput
              name="description"
              label={t("description")}
              control={form.control}
              isRequired={false}
            />
          </div>
        </div>
        <div className="grid grid-cols-1">
          <Card className="text-[12px]">
            <CardHeader className="py-0 text-lg">
              <CardTitle className="py-0 text-[12px]">{t("product")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="container mx-auto pb-2 pt-0">
                <FormPurchaseDetail
                  name="purchaseDetails"
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
        <div className="mb-3 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient w-fit uppercase !text-light-900 text-[11px]"
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
export default PurchaseForm;
