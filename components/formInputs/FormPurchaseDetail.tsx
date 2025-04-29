"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  type ArrayPath,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  useFieldArray,
  useFormContext,
  type UseFormSetValue,
} from "react-hook-form";

import FormInput from "./FormInput";
import FormCombobox from "./FormCombobox";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { Input } from "../ui/input";

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
  const { getValues } = useFormContext();
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
        const cost = Number.parseFloat(
          getValues(`${name}.${index}.cost`) || "0"
        );

        // Calculate total
        const total = qty * cost;

        console.log(`Row ${index} calculation: ${qty} × ${cost} = ${total}`);

        // Update the form
        setValue(
          `${name}.${index}.total` as Path<T>,
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
          getValues(`${name}.${index}.total`) || "0"
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
      const deliveryIn = Number.parseFloat(getValues("deliveryIn") || "0");
      const deliveryOut = Number.parseFloat(getValues("deliveryOut") || "0");
      const shippingFee = Number.parseFloat(getValues("shippingFee") || "0");
      const serviceFee = Number.parseFloat(getValues("serviceFee") || "0");

      // Calculate grand total
      const grandTotal =
        subtotal +
        deliveryIn +
        deliveryOut +
        shippingFee +
        serviceFee -
        discount;

      console.log(
        `Grand total calculation: ${subtotal} + ${deliveryIn} + ${deliveryOut} + ${shippingFee} + ${serviceFee} - ${discount} = ${grandTotal}`
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
      wholeSalePrice: 0,
      total: 0,
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

          console.log(
            `Setting cost for row ${index}: ${defaultUnit.cost || 0}`
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
            console.log(`Setting cost for row ${index}: ${unit.cost || 0}`);

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
          } else {
            // If unit not found in local state, fetch product details again
            const productId = getValues(`${name}.${index}.product`);
            if (productId) {
              const productDetails = await fetchProductDetails(productId);

              setUnits((prevUnits) => ({
                ...prevUnits,
                [index]: Array.isArray(productDetails.data)
                  ? productDetails.data
                  : [],
              }));

              // Try to find the unit again
              const refetchedUnit = Array.isArray(productDetails.data)
                ? productDetails.data.find((u) => u._id === unitId)
                : null;

              if (refetchedUnit) {
                setValue(
                  `${name}.${index}.cost` as Path<T>,
                  (refetchedUnit.cost || 0) as unknown as PathValue<T, Path<T>>,
                  { shouldValidate: false }
                );

                // Calculate totals after a small delay
                setTimeout(() => {
                  calculateRowTotal(index);
                  calculateGrandTotal();
                }, 100);
              }
            }
          }
        } catch (error) {
          console.error(`Error in handleUnitChange for row ${index}:`, error);
        }
      }
    },
    [
      units,
      setValue,
      calculateRowTotal,
      calculateGrandTotal,
      getValues,
      name,
      fetchProductDetails,
    ]
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
            description: `${product.title} has been added to the purchase`,
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
          {/* <Button
            type="button"
            className="bg-purple-600 text-[11px] hover:bg-purple-500 text-white flex items-center justify-center md:w-[100px] h-[28px] min-h-[28px]"
            onClick={handleManualRecalculate}
          >
            <Calculator className="mr-1 size-3" /> {t("calculate")}
          </Button> */}
        </div>
      </div>

      {/* Header Row - Static labels */}
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 pb-1 md:grid-cols-11 text-[12px] hidden lg:grid leading-[0] mt-3">
        <div className="col-span-2 sm:col-span-1 md:col-span-3">
          {t("product")}
        </div>
        <div className="col-span-2 sm:col-span-1 md:col-span-2">
          {t("unit")}
        </div>
        <div className="col-span-1 sm:col-span-1 md:col-span-1">{t("qty")}</div>
        <div className="col-span-2 sm:col-span-1 md:col-span-2 text-left">
          {t("cost")}
        </div>
        <div className="col-span-2 sm:col-span-1 md:col-span-2">
          {t("total")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-11">
        {fields.map((field, index) => {
          const selectedProduct = selectedProducts[index];
          const singleProduct = (field as any).selectedProduct;
          return (
            <React.Fragment key={field.id}>
              <div className={`col-span-2 sm:col-span-1 md:col-span-3`}>
                <FormCombobox
                  control={control}
                  name={`${name}.${index}.product` as Path<T>}
                  label={t("product")}
                  labelClass={"block lg:hidden mt-2"}
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
              <div className={`col-span-2 sm:col-span-1 md:col-span-2`}>
                <FormInput
                  type="number"
                  name={`${name}.${index}.cost` as Path<T>}
                  labelClass={"block lg:hidden"}
                  label={t("cost")}
                  control={control}
                  onChange={() => {
                    console.log(`Cost changed for row ${index}`);
                    calculateRowTotal(index);
                    calculateGrandTotal();
                  }}
                />
              </div>
              <div className={`col-span-2 sm:col-span-1 md:col-span-2`}>
                <FormInput
                  type="number"
                  name={`${name}.${index}.total` as Path<T>}
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
                  onClick={() => {
                    remove(index);
                    // Recalculate totals after removing a row
                    setTimeout(() => {
                      calculateGrandTotal();
                    }, 500);
                  }}
                  disabled={index === 0 && fields.length === 1}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500 flex items-center gap-2 min-h-[28px] h-[28px]"
                  aria-label={`Remove purchase detail ${index + 1}`}
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
          onChange={() => {
            console.log("Delivery out changed");
            calculateGrandTotal();
          }}
        />
        <FormInput
          type="number"
          name={"shippingFee" as Path<T>}
          control={control}
          label={t("shippingFee")}
          onChange={() => {
            console.log("Shipping fee changed");
            calculateGrandTotal();
          }}
        />
        <FormInput
          type="number"
          name={"serviceFee" as Path<T>}
          control={control}
          label={t("serviceFee")}
          onChange={() => {
            console.log("Service fee changed");
            calculateGrandTotal();
          }}
        />
        <FormInput
          type="number"
          name={"deliveryIn" as Path<T>}
          control={control}
          label={t("deliveryIn")}
          onChange={() => {
            console.log("Delivery in changed");
            calculateGrandTotal();
          }}
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
            onChange={() => {
              console.log("Discount changed");
              calculateGrandTotal();
            }}
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

      <div className="mt-4 text-xs text-gray-500 border-t pt-2">
        <p className="font-semibold">{t("keyboardShortcuts")}:</p>
        <div className="grid grid-cols-2 gap-1 mt-1">
          <div>F2 / Ctrl+B: {t("focusBarcodeInput")}</div>
          <div>F3: {t("addNewRow")}</div>
          <div>Enter: {t("scanBarcode")}</div>
          <div>Space: {t("addNewRow")}</div>
        </div>
      </div>
    </div>
  );
}

export default FormPurchaseDetail;
