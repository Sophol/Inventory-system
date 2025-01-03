"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import FormInput from "./FormInput";
import FormCombobox from "./FormCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SelectData {
  _id: string;
  title: string | undefined;
  cost?: number | undefined;
}

interface FormPurchaseDetailProps {
  control: any;
  setValue: any;
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
}

const FormPurchaseDetail: React.FC<FormPurchaseDetailProps> = ({
  control,
  setValue,
  fetchProducts,
  fetchUnits,
  fetchProductDetails,
}) => {
  const { watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "purchaseDetails",
  });
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: string;
  }>({});
  const [units, setUnits] = useState<SelectData[]>([]);

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
    });
  }, [append]);
  const calculateSubTotal = useCallback(() => {
    const subTotal = fields.reduce((acc, _, index) => {
      const total = parseFloat(watch(`purchaseDetails.${index}.total`) || "0");
      return acc + total;
    }, 0);

    setValue("subtotal", subTotal);
  }, [fields, watch, setValue]);

  const calculateGrandTotal = useCallback(() => {
    const subTotal = parseFloat(watch("subtotal") || "0");
    const discount = parseFloat(watch("discount") || "0");
    const grandTotal = subTotal - discount;
    setValue("grandtotal", grandTotal);
  }, [watch, setValue]);

  const calculateTotal = useCallback(
    (index: number) => {
      const qty = parseFloat(watch(`purchaseDetails.${index}.qty`) || "0");
      const cost = parseFloat(watch(`purchaseDetails.${index}.cost`) || "0");
      const total = qty * cost;
      setValue(`purchaseDetails.${index}.total`, total);
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
        console.log("productDetails", productDetails);
        setUnits(Array.isArray(productDetails.data) ? productDetails.data : []);
        setValue(`purchaseDetails.${index}.unit`, productDetails.data || "");
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
    [setValue, fetchProductDetails, calculateTotal]
  );

  const handleUnitChange = useCallback(
    async (index: number, unitId: string) => {
      if (unitId) {
        const unit = units.find((unit) => unit._id === unitId);
        console.log("unit", units);
        if (unit) {
          setValue(`purchaseDetails.${index}.cost`, unit.cost || 0);
          calculateTotal(index);
        }
      }
    },
    [units, setValue, calculateTotal]
  );
  return (
    <div className="flex flex-col justify-start gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-11">
        {fields.map((field, index) => {
          const selectedProduct = selectedProducts[index];
          return (
            <React.Fragment key={field.id}>
              <div className="col-span-2 md:col-span-3">
                <Input type="hidden" value={field.id} disabled />
                <FormCombobox
                  control={control}
                  name={`purchaseDetails.${index}.product`}
                  label="Product"
                  placeholder="Select Product"
                  fetchSingleItem={field.selectedProduct}
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
                  name={`purchaseDetails.${index}.unit`}
                  label="Unit"
                  placeholder="Select unit"
                  fetchSingleItem={field.selectedUnit}
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
                name={`purchaseDetails.${index}.qty`}
                label="Qty"
                control={control}
                onChange={() => calculateTotal(index)}
              />
              <div className="col-span-1 md:col-span-2">
                <FormInput
                  type="number"
                  name={`purchaseDetails.${index}.cost`}
                  label="Cost"
                  control={control}
                  onChange={() => calculateTotal(index)}
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <FormInput
                  type="number"
                  name={`purchaseDetails.${index}.total`}
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
      <div className="flex items-center gap-4">
        <div className="grow text-right">
          <label className="">Sub Total</label>
        </div>
        <div className="flex w-[295px]">
          <FormInput
            type="number"
            name="subtotal"
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
            name="discount"
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
            name="grandtotal"
            control={control}
            readonly={true}
          />
          <div className="w-14 flex-none"></div>
        </div>
      </div>
    </div>
  );
};

export default FormPurchaseDetail;
