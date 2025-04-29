"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
  type Control,
  type FieldValues,
  type UseFormSetValue,
  type Path,
  type PathValue,
  type ArrayPath,
} from "react-hook-form";

import FormInput from "./FormInput";
import FormCombobox from "./FormCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormSelect from "./FormSelect";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";

interface SelectData {
  _id: string;
  title: string;
  cost?: number;
  price?: number;
  wholeSalePrice?: number;
}

interface FormSaleDetailProps<T extends FieldValues> {
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
  defaultValue?: string;
}

function FormSaleDetail<T extends FieldValues>({
  control,
  setValue,
  fetchProducts,
  fetchUnits,
  fetchProductDetails,
  name,
  defaultValue,
}: FormSaleDetailProps<T>) {
  const t = useTranslations("erp");
  const { watch, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: string;
  }>({});
  const [productNames, setProductNames] = useState<{
    [key: number]: string;
  }>({});
  const [units, setUnits] = useState<{ [key: number]: SelectData[] }>({});
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastCalculation, setLastCalculation] = useState<string>("");

  const barcodeInputRefs = useRef<{
    [key: number]: HTMLInputElement | null;
    main: HTMLInputElement | null;
  }>({ main: null });

  // Calculate row total
  const calculateRowTotal = useCallback(
    (index: number) => {
      try {
        // Get values directly from the form
        const qty = Number.parseFloat(getValues(`${name}.${index}.qty`) || "0");
        const price = Number.parseFloat(
          getValues(`${name}.${index}.price`) || "0"
        );

        // Calculate total
        const total = qty * price;

        console.log(`Row ${index} calculation: ${qty} × ${price} = ${total}`);

        // Update the form
        setValue(
          `${name}.${index}.totalPrice` as Path<T>,
          total as unknown as PathValue<T, Path<T>>,
          {
            shouldValidate: false,
          }
        );

        return total;
      } catch (error) {
        console.error(`Error calculating row ${index} total:`, error);
        return 0;
      }
    },
    [getValues, setValue, name]
  );

  // Calculate subtotal
  const calculateSubtotal = useCallback(() => {
    try {
      let subtotal = 0;

      // Calculate each row's total and sum them up
      fields.forEach((_, index) => {
        // First ensure each row's total is up to date
        calculateRowTotal(index);

        // Then get the total
        const rowTotal = Number.parseFloat(
          getValues(`${name}.${index}.totalPrice`) || "0"
        );
        subtotal += rowTotal;
      });

      console.log(`Subtotal calculation: ${subtotal}`);

      // Update the form
      setValue(
        "subtotal" as Path<T>,
        subtotal as unknown as PathValue<T, Path<T>>,
        { shouldValidate: false }
      );

      return subtotal;
    } catch (error) {
      console.error("Error calculating subtotal:", error);
      return 0;
    }
  }, [fields, calculateRowTotal, getValues, setValue, name]);

  // Calculate grand total
  const calculateGrandTotal = useCallback(() => {
    try {
      // First ensure subtotal is up to date
      const subtotal = calculateSubtotal();

      // Get other values
      const discount = Number.parseFloat(getValues("discount") || "0");
      const delivery = Number.parseFloat(getValues("delivery") || "0");

      // Calculate grand total
      const grandTotal = subtotal - discount + delivery;

      console.log(
        `Grand total calculation: ${subtotal} - ${discount} + ${delivery} = ${grandTotal}`
      );

      // Update the form
      setValue(
        "grandtotal" as Path<T>,
        grandTotal as unknown as PathValue<T, Path<T>>,
        { shouldValidate: false }
      );

      // Update last calculation timestamp for debugging
      setLastCalculation(new Date().toISOString());

      return grandTotal;
    } catch (error) {
      console.error("Error calculating grand total:", error);
      return 0;
    }
  }, [calculateSubtotal, getValues, setValue]);

  // Add a new row
  const handleAddUnit = useCallback(() => {
    append({
      product: "",
      unit: "",
      qty: 1,
      cost: 0,
      price: 0,
      totalPrice: 0,
    } as any);
  }, [append]);

  // Update selected products when fields change
  useEffect(() => {
    const updatedProducts = fields.reduce(
      (acc: { [key: number]: string }, _, index) => {
        acc[index] = getValues(`${name}.${index}.product`) || "";
        return acc;
      },
      {}
    );
    setSelectedProducts(updatedProducts);
  }, [fields, getValues, name]);

  // Handle product change
  const handleProductChange = useCallback(
    async (index: number, productId: string) => {
      try {
        console.log(
          `Handling product change for row ${index}, product: ${productId}`
        );

        const productDetails = await fetchProductDetails(productId);
        const productUnits = Array.isArray(productDetails.data)
          ? productDetails.data
          : [];

        setUnits((prevUnits) => ({
          ...prevUnits,
          [index]: productUnits,
        }));

        // Set default unit if available
        if (productUnits.length > 0) {
          const defaultUnit = productUnits[0];

          console.log(
            `Setting default unit for row ${index}: ${defaultUnit._id}`
          );

          setValue(
            `${name}.${index}.unit` as Path<T>,
            defaultUnit._id as unknown as PathValue<T, Path<T>>,
            {
              shouldValidate: false,
            }
          );

          const saleType = getValues("saleType") || "retail";
          const price =
            saleType === "wholesale"
              ? defaultUnit.wholeSalePrice || 0
              : defaultUnit.price || 0;

          console.log(`Setting price for row ${index}: ${price} (${saleType})`);

          setValue(
            `${name}.${index}.price` as Path<T>,
            price as unknown as PathValue<T, Path<T>>,
            {
              shouldValidate: false,
            }
          );

          setValue(
            `${name}.${index}.cost` as Path<T>,
            (defaultUnit.cost || 0) as unknown as PathValue<T, Path<T>>,
            {
              shouldValidate: false,
            }
          );

          // Ensure qty is at least 1
          const currentQty = Number.parseFloat(
            getValues(`${name}.${index}.qty`) || "0"
          );
          if (currentQty <= 0) {
            setValue(
              `${name}.${index}.qty` as Path<T>,
              1 as unknown as PathValue<T, Path<T>>,
              {
                shouldValidate: false,
              }
            );
          }
        }

        // Update the selectedProducts state
        setSelectedProducts((prev) => ({
          ...prev,
          [index]: productId,
        }));

        // Store product name for display
        if (productUnits.length > 0) {
          setProductNames((prev) => ({
            ...prev,
            [index]: productUnits[0].title || "",
          }));
        }

        // Calculate totals after a small delay to ensure all values are set
        setTimeout(() => {
          calculateRowTotal(index);
          calculateGrandTotal();
        }, 100);
      } catch (error) {
        console.error(`Error in handleProductChange for row ${index}:`, error);
      }
    },
    [
      fetchProductDetails,
      calculateRowTotal,
      calculateGrandTotal,
      setValue,
      name,
      getValues,
    ]
  );

  // Handle unit change
  const handleUnitChange = useCallback(
    async (index: number, unitId: string) => {
      if (unitId) {
        try {
          console.log(`Handling unit change for row ${index}, unit: ${unitId}`);

          const unit = units[index]?.find((unit) => unit._id === unitId);
          if (unit) {
            const saleType = getValues("saleType") || "retail";
            const price =
              saleType === "wholesale"
                ? unit.wholeSalePrice || 0
                : unit.price || 0;

            console.log(
              `Setting price for row ${index}: ${price} (${saleType})`
            );

            setValue(
              `${name}.${index}.price` as Path<T>,
              price as unknown as PathValue<T, Path<T>>,
              {
                shouldValidate: false,
              }
            );

            setValue(
              `${name}.${index}.cost` as Path<T>,
              (unit.cost || 0) as unknown as PathValue<T, Path<T>>,
              {
                shouldValidate: false,
              }
            );

            // Calculate totals after a small delay
            setTimeout(() => {
              calculateRowTotal(index);
              calculateGrandTotal();
            }, 100);
          }
        } catch (error) {
          console.error(`Error in handleUnitChange for row ${index}:`, error);
        }
      }
    },
    [units, setValue, calculateRowTotal, calculateGrandTotal, getValues, name]
  );

  // Handle sale type change
  const handleSaleTypeChange = useCallback(
    (value: string) => {
      console.log(`Sale type changed to: ${value}`);

      // Update prices based on sale type for all rows
      fields.forEach((_, index) => {
        const unitId = getValues(`${name}.${index}.unit`);
        if (unitId) {
          const unit = units[index]?.find((u) => u._id === unitId);
          if (unit) {
            const price =
              value === "wholesale"
                ? unit.wholeSalePrice || 0
                : unit.price || 0;

            console.log(
              `Updating price for row ${index} to ${price} based on sale type ${value}`
            );

            setValue(
              `${name}.${index}.price` as Path<T>,
              price as unknown as PathValue<T, Path<T>>,
              {
                shouldValidate: false,
              }
            );
          }
        }
      });

      // Calculate all totals after a small delay
      setTimeout(() => {
        calculateGrandTotal();
      }, 100);
    },
    [fields, getValues, name, units, setValue, calculateGrandTotal]
  );

  // Find the first empty row or return -1 if no empty rows
  const findEmptyRowIndex = useCallback(() => {
    for (let i = 0; i < fields.length; i++) {
      const productId = getValues(`${name}.${i}.product`);
      if (!productId) {
        return i;
      }
    }
    return -1;
  }, [fields, getValues, name]);

  // Handle barcode scanning
  const handleBarcodeScanned = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const barcode = e.target?.value?.trim();
      if (!barcode || isScanning) return;

      setIsScanning(true);
      try {
        console.log(`Scanning barcode: ${barcode}`);
        const result = await fetchProducts({ page: 1, query: barcode });

        if (result.data && result.data.length > 0) {
          const product = result.data[0];

          console.log(`Product found: ${product.title} (${product._id})`);

          // Find the first empty row or add a new one
          let rowIndex = findEmptyRowIndex();
          if (rowIndex === -1) {
            handleAddUnit();
            rowIndex = fields.length;
            console.log(`Added new row at index ${rowIndex}`);
          } else {
            console.log(`Using existing empty row at index ${rowIndex}`);
          }

          // Set product ID
          setValue(
            `${name}.${rowIndex}.product` as Path<T>,
            product._id as unknown as PathValue<T, Path<T>>,
            {
              shouldValidate: false,
            }
          );

          // Store product name for display
          setProductNames((prev) => ({
            ...prev,
            [rowIndex]: product.title || "",
          }));

          // Process product details (units, price, etc.)
          await handleProductChange(rowIndex, product._id);

          // Clear the barcode input field
          if (barcodeInputRefs.current.main) {
            barcodeInputRefs.current.main.value = "";
            barcodeInputRefs.current.main.focus();
          }

          // Force recalculation of all totals with a longer delay
          setTimeout(() => {
            calculateGrandTotal();
          }, 300);

          // Show success notification
          toast({
            title: "Product added",
            description: `${product.title} has been added to the sale`,
            duration: 3000,
          });
        } else {
          console.log(`No product found with barcode: ${barcode}`);
          toast({
            title: "Product not found",
            description: `No product found with code: ${barcode}`,
            variant: "destructive",
            duration: 3000,
          });

          // Play error sound (optional)
          try {
            const audio = new Audio("/sounds/error-beep.mp3");
            audio.play().catch((e) => console.log("Audio play failed", e));
          } catch (error) {
            console.log("Error playing sound", error);
          }

          // Clear the barcode input field and refocus
          if (barcodeInputRefs.current.main) {
            barcodeInputRefs.current.main.value = "";
            barcodeInputRefs.current.main.focus();
          }
        }
      } catch (error) {
        console.error("Error scanning barcode:", error);
        toast({
          title: "Error",
          description: "Failed to process barcode. Please try again.",
          variant: "destructive",
          duration: 3000,
        });

        // Clear the barcode input field and refocus
        if (barcodeInputRefs.current.main) {
          barcodeInputRefs.current.main.value = "";
          barcodeInputRefs.current.main.focus();
        }
      } finally {
        setIsScanning(false);
      }
    },
    [
      fetchProducts,
      setValue,
      name,
      handleProductChange,
      isScanning,
      handleAddUnit,
      fields.length,
      findEmptyRowIndex,
      calculateGrandTotal,
    ]
  );

  // Handle keydown events globally for the component
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // F2 key to focus on barcode input
      if (e.key === "F2") {
        e.preventDefault();
        if (barcodeInputRefs.current.main) {
          barcodeInputRefs.current.main.focus();
        }
      }

      // F3 key to add a new empty row
      if (e.key === "F3") {
        e.preventDefault();
        handleAddUnit();
        // Calculate totals after adding a new row
        setTimeout(() => {
          calculateGrandTotal();
        }, 100);
      }

      // Ctrl+B to focus on barcode input
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        if (barcodeInputRefs.current.main) {
          barcodeInputRefs.current.main.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    // Focus on barcode input when component mounts
    if (barcodeInputRefs.current.main) {
      barcodeInputRefs.current.main.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleAddUnit, calculateGrandTotal]);

  // Ensure there's always at least one row
  useEffect(() => {
    if (fields.length === 0) {
      handleAddUnit();
    }
  }, [fields.length, handleAddUnit]);

  // Initial calculation when component mounts
  useEffect(() => {
    // Calculate totals after component mounts
    const timer = setTimeout(() => {
      calculateGrandTotal();
    }, 500);

    return () => clearTimeout(timer);
  }, [calculateGrandTotal]);

  // Force recalculation when fields change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateGrandTotal();
    }, 200);

    return () => clearTimeout(timer);
  }, [fields.length, calculateGrandTotal]);

  const saleTypeData: SelectData[] = [
    { _id: "retail", title: "Retail" },
    { _id: "wholesale", title: "Whole Sale" },
  ];

  // Manual recalculation function for the button
  // const handleManualRecalculate = useCallback(() => {
  //   console.log("Manual recalculation triggered");
  //   calculateGrandTotal();
  // }, [calculateGrandTotal]);

  return (
    <div className="flex flex-col justify-start gap-1 text-[11px] md:text-base">
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <div className="w-full md:w-60 relative">
          <label className="text-[11px] text-dark400_light800 mb-1">
            {t("scanBarcode")}
            <Input
              type="text"
              name="barcode"
              className="text-[11px] mt-auto light-border-3 text-dark300_light700 no-focus min-h-[28px] h-[28px] border"
              autoFocus
              ref={(el) => {
                barcodeInputRefs.current.main = el;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleBarcodeScanned(e as any);
                }
              }}
              onChange={(e) => {
                // Clear any previous value when user starts typing
                if (e.target.value === "") {
                  return;
                }
              }}
              placeholder={t("scanBarcodeHere")}
            />
          </label>
          {isScanning && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/4">
              <div className="animate-pulse h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            className="bg-green-600 text-[11px] hover:bg-green-500 text-white flex items-center justify-center w-full md:w-[100px] sm:mt-0 sm:mb-3 md:mb-0 md:mt-0 h-[28px] min-h-[28px]"
            onClick={() => {
              handleAddUnit();
              // Calculate totals after adding a new row
              setTimeout(() => {
                calculateGrandTotal();
              }, 100);
            }}
          >
            <Plus className="mr-1 size-3" /> {t("addUnit")}
          </Button>
        </div>
      </div>

      <div className="w-full md:w-60 mt-2 hidden">
        <FormSelect
          name={"saleType" as Path<T>}
          items={saleTypeData}
          label="Sale Type"
          defaultValue={defaultValue || "retail"}
          control={control}
          onChange={handleSaleTypeChange}
        />
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
          {t("price")}
          <span className="text-primary-500 pl-1">*</span>
        </div>
        <div className="col-span-2 sm:col-span-1 md:col-span-2">
          {t("total")}
          <span className="text-primary-500 pl-1">*</span>
        </div>
      </div>

      {/* Product Detail Rows */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-11">
        {fields.map((field, index) => {
          const selectedProduct = selectedProducts[index];

          return (
            <React.Fragment key={field.id}>
              <div className={`col-span-2 sm:col-span-1 md:col-span-3`}>
                <Input type="hidden" value={field.id} disabled />
                <FormCombobox
                  control={control}
                  name={`${name}.${index}.product` as Path<T>}
                  label={t("product")}
                  labelClass={"block lg:hidden"}
                  fetchSingleItem={(field as any).selectedProduct}
                  fetchData={fetchProducts}
                  setValue={(name, value) => {
                    setValue(name, value);
                    handleProductChange(index, value as string);
                  }}
                />
              </div>
              <div className={`col-span-2 sm:col-span-1 md:col-span-2`}>
                <FormCombobox
                  control={control}
                  name={`${name}.${index}.unit` as Path<T>}
                  label={t("unit")}
                  labelClass={"block lg:hidden"}
                  fetchSingleItem={(field as any).selectedUnit}
                  parentId={selectedProduct}
                  fetchData={(params) =>
                    fetchUnits({ ...params, parentId: selectedProduct })
                  }
                  setValue={(name, value) => {
                    setValue(name, value);
                    handleUnitChange(index, value as string);
                  }}
                />
              </div>
              <FormInput
                type="number"
                name={`${name}.${index}.qty` as Path<T>}
                label={t("qty")}
                labelClass={"block lg:hidden"}
                control={control}
                onChange={() => {
                  console.log(`Quantity changed for row ${index}`);
                  calculateRowTotal(index);
                  calculateGrandTotal();
                }}
              />
              <div className={`col-span-2 sm:col-span-2 md:col-span-2`}>
                <FormInput
                  type="number"
                  name={`${name}.${index}.price` as Path<T>}
                  label={t("price")}
                  labelClass={"block lg:hidden"}
                  control={control}
                  onChange={() => {
                    console.log(`Price changed for row ${index}`);
                    calculateRowTotal(index);
                    calculateGrandTotal();
                  }}
                />
                <FormInput
                  type="hidden"
                  name={`${name}.${index}.cost` as Path<T>}
                  control={control}
                />
              </div>
              <div className={`col-span-2 sm:col-span-1 md:col-span-2`}>
                <FormInput
                  type="number"
                  name={`${name}.${index}.totalPrice` as Path<T>}
                  label={t("total")}
                  labelClass={"block lg:hidden"}
                  control={control}
                  readonly={true}
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col justify-end md:col-end-auto w-full sm:w-full mt-0 min-h-[28px] h-[28px]">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    remove(index);
                    // Recalculate totals after removing a row
                    setTimeout(() => {
                      calculateGrandTotal();
                    }, 500);
                  }}
                  disabled={index === 0 && fields.length === 1}
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

      {/* Total Calculation Fields */}
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
      <div className="flex items-center gap-2 flex-wrap">
        <div className="grow text-right">
          <label className="text-[11px]">{t("discount")}</label>
        </div>
        <div className="flex w-[275px]">
          <FormInput
            type="number"
            name={"discount" as Path<T>}
            control={control}
            onChange={() => {
              calculateGrandTotal();
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="grow text-right">
          <label className="text-[11px]">{t("delivery")}</label>
        </div>
        <div className="flex w-[275px]">
          <FormInput
            type="number"
            name={"delivery" as Path<T>}
            control={control}
            onChange={() => {
              calculateGrandTotal();
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
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

export default FormSaleDetail;
