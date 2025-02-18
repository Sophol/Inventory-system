"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  ArrayPath,
  Control,
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
  UseFormSetValue,
} from "react-hook-form";

import FormInput from "./FormInput";
import FormCombobox from "./FormCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface SelectData {
  _id: string;
  title: string | undefined;
  cost?: number | undefined;
}

interface FormPurchaseDetailProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  fetchProducts: (params: {
    page: number;
    query: string;
  }) => Promise<{ data: SelectData[]; isNext: boolean }>;
  fetchUnits: (params: {
    page: number;
    query: string;
    parentId?: string;
  }) => Promise<{ data: SelectData[]; isNext: boolean }>;
  fetchProductDetails: (
    productId: string
  ) => Promise<{ data: SelectData[]; isNext: boolean }>;
  name: ArrayPath<T>;
}

function FormPurchaseDetail<T extends FieldValues>({
  control,
  setValue,
  fetchProducts,
  fetchUnits,
  fetchProductDetails,
  name,
}: FormPurchaseDetailProps<T>) {
  const t = useTranslations("erp");
  const { watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: string;
  }>({});
  const [units, setUnits] = useState<{ [key: number]: SelectData[] }>({});

  const watchPurchaseDetails = watch("purchaseDetails");

  useEffect(() => {
    const updatedProducts = fields.reduce(
      (acc: { [key: number]: string }, _, index) => {
        acc[index] = watchPurchaseDetails?.[index]?.product || "";
        return acc;
      },
      {}
    );
    setSelectedProducts(updatedProducts);
  }, [fields, watchPurchaseDetails]);

  const handleAddUnit = useCallback(() => {
    append({
      product: "",
      unit: "",
      qty: 0,
      cost: 0,
      price: 0,
      wholeSalePrice: 0,
      total: 0,
    } as any);
  }, [append]);

  const calculateSubTotal = useCallback(() => {
    const subTotal = fields.reduce((acc, _, index) => {
      const total = parseFloat(watch(`purchaseDetails.${index}.total`) || "0");
      return acc + total;
    }, 0);

    setValue("subtotal" as Path<T>, subTotal as PathValue<T, Path<T>>);
  }, [fields, watch, setValue]);

  const calculateGrandTotal = useCallback(() => {
    const subTotal = parseFloat(watch("subtotal") || "0");
    const discount = parseFloat(watch("discount") || "0");
    const deliveryIn = parseFloat(watch("deliveryIn") || "0");
    const deliveryOut = parseFloat(watch("deliveryOut") || "0");
    const shippingFee = parseFloat(watch("shippingFee") || "0");
    const serviceFee = parseFloat(watch("serviceFee") || "0");
    const grandTotal =
      subTotal + deliveryIn + deliveryOut + shippingFee + serviceFee - discount;
    setValue("grandtotal" as Path<T>, grandTotal as PathValue<T, Path<T>>);
  }, [watch, setValue]);

  const calculateTotal = useCallback(
    (index: number) => {
      const qty = parseFloat(watch(`purchaseDetails.${index}.qty`) || "0");
      const cost = parseFloat(watch(`purchaseDetails.${index}.cost`) || "0");
      const total = qty * cost;
      setValue(
        `purchaseDetails.${index}.total` as Path<T>,
        total as PathValue<T, Path<T>>
      );
      calculateSubTotal();
      calculateGrandTotal();
    },
    [watch, setValue, calculateGrandTotal, calculateSubTotal]
  );

  useEffect(() => {
    fields.forEach((_, index) => {
      calculateTotal(index);
    });
  }, [fields, calculateTotal]);

  const handleProductChange = useCallback(
    async (index: number, productId: string) => {
      try {
        const productDetails = await fetchProductDetails(productId);
        setUnits((prevUnits) => ({
          ...prevUnits,
          [index]: Array.isArray(productDetails.data)
            ? productDetails.data
            : [],
        }));
        calculateTotal(index);

        // Update the selectedProducts state
        setSelectedProducts((prev) => ({
          ...prev,
          [index]: productId,
        }));
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    },
    [fetchProductDetails, calculateTotal]
  );

  const handleUnitChange = useCallback(
    async (index: number, unitId: string) => {
      if (unitId) {
        const unit = units[index]?.find((unit) => unit._id === unitId);

        if (unit) {
          setValue(
            `purchaseDetails.${index}.cost` as Path<T>,
            unit.cost as PathValue<T, Path<T>>
          );
          calculateTotal(index);
        } else {
          const productId = watch(`purchaseDetails.${index}.product`);
          const productDetails = await fetchProductDetails(productId);
          setUnits((prevUnits) => ({
            ...prevUnits,
            [index]: Array.isArray(productDetails.data)
              ? productDetails.data
              : [],
          }));
          const unit = units[index]?.find((unit) => unit._id === unitId);

          if (unit) {
            setValue(
              `purchaseDetails.${index}.cost` as Path<T>,
              unit.cost as PathValue<T, Path<T>>
            );
            calculateTotal(index);
          }
        }
      }
    },
    [watch, fetchProductDetails, units, setValue, calculateTotal]
  );

  return (
    <div className="flex flex-col justify-start gap-1 text-[11px] md:text-base">
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <div className="w-full md:w-60"></div>
        <Button
          type="button"
          className="bg-green-600 text-[11px] hover:bg-green-500 text-white flex items-center justify-center w-full md:w-[100px] sm:mt-0 sm:mb-3 md:mb-0  md:mt-0 h-[28px] min-h-[28px]"
          onClick={handleAddUnit}
        >
          <Plus className="mr-1 size-3 " /> {t("addUnit")}
        </Button>
      </div>
      {/* Header Row - Static labels */}
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 pb-1 md:grid-cols-11 text-[12px] hidden lg:grid leading-[0] mt-3">
        <div className="col-span-2 sm:col-span-1 md:col-span-3  ">
          {t("product")}
          <span className="text-primary-500 pl-1">*</span>
        </div>
        <div className="col-span-2 sm:col-span-1 md:col-span-2">
          {t("unit")}
          <span className="text-primary-500 pl-1">*</span>
        </div>
        <div className="col-span-1 sm:col-span-1 md:col-span-1">
          {t("qty")}
          <span className="text-primary-500 pl-1">*</span>
        </div>
        <div className="col-span-2 sm:col-span-1 md:col-span-2 text-left">
          {t("cost")}
          <span className="text-primary-500 pl-1">*</span>
        </div>
        <div className="col-span-2 sm:col-span-1 md:col-span-2">
          {t("total")}
          <span className="text-primary-500 pl-1">*</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-11">
        {fields.map((field, index) => {
          const selectedProduct = selectedProducts[index];
          const singleProduct = (field as any).selectedProduct;
          return (
            <React.Fragment key={field.id}>
              <div className={`col-span-2 sm:col-span-1 md:col-span-3`}>
                <Input type="hidden" value={field.id} disabled />
                <FormCombobox
                  control={control}
                  name={`${name}.${index}.product` as Path<T>}
                  label={t("product")}
                  labelClass={"block lg:hidden"}
                  // placeholder="Select Product"
                  fetchSingleItem={singleProduct}
                  fetchData={fetchProducts}
                  setValue={(name, value) => {
                    setValue(name, value);
                    handleProductChange(index, value);
                  }}
                />
              </div>
              <div className={`col-span-2 sm:col-span-2 md:col-span-2`}>
                <FormCombobox
                  control={control}
                  name={`${name}.${index}.unit` as Path<T>}
                  label={t("unit")}
                  labelClass={"block lg:hidden"}
                  // placeholder="Select unit"
                  fetchSingleItem={(field as any).selectedUnit}
                  parentId={selectedProduct}
                  fetchData={(params) =>
                    fetchUnits({ ...params, parentId: selectedProduct })
                  }
                  setValue={(name, value) => {
                    setValue(name, value);
                    handleUnitChange(index, value);
                  }}
                />
              </div>
              <FormInput
                type="number"
                name={`purchaseDetails.${index}.qty` as Path<T>}
                label={t("qty")}
                labelClass={"block lg:hidden"}
                control={control}
                onChange={() => calculateTotal(index)}
              />
              <div className={`col-span-2 sm:col-span-1 md:col-span-2`}>
                <FormInput
                  type="number"
                  name={`purchaseDetails.${index}.cost` as Path<T>}
                  labelClass={"block lg:hidden"}
                  label={t("cost")}
                  control={control}
                  onChange={() => calculateTotal(index)}
                />
              </div>
              <div className={`col-span-2 sm:col-span-1 md:col-span-2`}>
                <FormInput
                  type="number"
                  name={`purchaseDetails.${index}.total` as Path<T>}
                  labelClass={"block lg:hidden"}
                  label={t("total")}
                  control={control}
                  readonly={true}
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col justify-end md:col-end-auto w-full sm:w-full mt-0 min-h-[28px] h-[28px]">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={index === 0}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500 flex items-center gap-2  min-h-[28px] h-[28px]"
                  aria-label={`Remove sale detail ${index + 1}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <FormInput
          type="number"
          name={"deliveryOut" as Path<T>}
          control={control}
          label={t("deliveryOut")}
          onChange={calculateGrandTotal}
        />
        <FormInput
          type="number"
          name={"shippingFee" as Path<T>}
          control={control}
          label={t("shippingFee")}
          onChange={calculateGrandTotal}
        />
        <FormInput
          type="number"
          name={"serviceFee" as Path<T>}
          control={control}
          label={t("serviceFee")}
          onChange={calculateGrandTotal}
        />
        <FormInput
          type="number"
          name={"deliveryIn" as Path<T>}
          control={control}
          label={t("deliveryIn")}
          onChange={calculateGrandTotal}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap pt-3">
        <div className="grow text-right">
          <label className="text-[11px]">{t("subtotal")}</label>
        </div>
        <div className="flex w-[275px]">
          <FormInput
            type="number"
            name={"subtotal" as Path<T>}
            control={control}
            readonly={true}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="grow text-right">
          <label className="text-[11px]">{t("discount")}</label>
        </div>
        <div className="flex w-[275px]">
          <FormInput
            type="number"
            name={"discount" as Path<T>}
            control={control}
            onChange={calculateGrandTotal}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="grow text-right">
          <label className="text-[11px]">{t("grandtotal")}</label>
        </div>
        <div className="flex w-[275px]">
          <FormInput
            type="number"
            name={"grandtotal" as Path<T>}
            control={control}
            readonly={true}
          />
        </div>
      </div>
    </div>
  );
}

export default FormPurchaseDetail;
