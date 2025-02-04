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
    <div className="flex flex-col justify-start gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-11">
        {fields.map((field, index) => {
          const selectedProduct = selectedProducts[index];
          const singleProduct = (field as any).selectedProduct;
          return (
            <React.Fragment key={field.id}>
              <div className="col-span-2 md:col-span-3">
                <Input type="hidden" value={field.id} disabled />
                <FormCombobox
                  control={control}
                  name={`${name}.${index}.product` as Path<T>}
                  label="Product"
                  // placeholder="Select Product"
                  fetchSingleItem={singleProduct}
                  fetchData={fetchProducts}
                  setValue={(name, value) => {
                    setValue(name, value);
                    handleProductChange(index, value);
                  }}
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <FormCombobox
                  control={control}
                  name={`${name}.${index}.unit` as Path<T>}
                  label="Unit"
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
                label="Qty"
                control={control}
                onChange={() => calculateTotal(index)}
              />
              <div className="col-span-1 md:col-span-2">
                <FormInput
                  type="number"
                  name={`purchaseDetails.${index}.cost` as Path<T>}
                  label="Cost"
                  control={control}
                  onChange={() => calculateTotal(index)}
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <FormInput
                  type="number"
                  name={`purchaseDetails.${index}.total` as Path<T>}
                  label="Total"
                  control={control}
                  readonly={true}
                />
              </div>
              <div className="col-span-1 md:col-end-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={index === 0}
                  className="mt-7"
                  aria-label={`Remove purchase detail ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex justify-start">
        <Button
          type="button"
          className="bg-green-600 hover:bg-green-500 text-white"
          onClick={handleAddUnit}
        >
          <Plus className="mr-2 size-4" /> Add Unit
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-4">
        <FormInput
          type="number"
          name={"deliveryOut" as Path<T>}
          control={control}
          label="Delivery Out"
          onChange={calculateGrandTotal}
        />
        <FormInput
          type="number"
          name={"shippingFee" as Path<T>}
          control={control}
          label="Shipping Fee"
          onChange={calculateGrandTotal}
        />
        <FormInput
          type="number"
          name={"serviceFee" as Path<T>}
          control={control}
          label="Service Fee"
          onChange={calculateGrandTotal}
        />
        <FormInput
          type="number"
          name={"deliveryIn" as Path<T>}
          control={control}
          label="Delivery In"
          onChange={calculateGrandTotal}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="grow text-right">
          <label className="">Sub Total</label>
        </div>
        <div className="flex w-[295px]">
          <FormInput
            type="number"
            name={"subtotal" as Path<T>}
            control={control}
            readonly={true}
          />
          <div className="w-14 flex-none"></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="grow text-right">
          <label className="">Discount</label>
        </div>
        <div className="flex w-[295px]">
          <FormInput
            type="number"
            name={"discount" as Path<T>}
            control={control}
            onChange={calculateGrandTotal}
          />
          <div className="w-14 flex-none"></div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="grow text-right">
          <label className="">Grand Total</label>
        </div>
        <div className="flex w-[295px]">
          <FormInput
            type="number"
            name={"grandtotal" as Path<T>}
            control={control}
            readonly={true}
          />
          <div className="w-14 flex-none"></div>
        </div>
      </div>
    </div>
  );
}

export default FormPurchaseDetail;
