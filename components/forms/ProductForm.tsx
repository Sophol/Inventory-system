"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { X } from "lucide-react";

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
import { useTranslations } from "use-intl";
import Image from "next/image";
import { assets } from "@/assets/assets";

interface Product {
  _id: string;
  title: string;
  status: string;
  code: string;
  description: string;
  image: string;
  units: {
    unit: string;
    qty: number;
    cost: number;
    price: number;
    wholeSalePrice: number;
    level: number;
  }[];
  category: string;
  categoryTitle: string;
  qtyOnHand: number;
  alertQty: number;
  product_images: string[];
}

interface SelectData {
  _id: string;
  title: string;
}

interface Params {
  product?: Product;
  isEdit?: boolean;
}

const ProductForm = ({ product, isEdit = false }: Params) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();

  // Track both existing images and new file uploads
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.product_images || []
  );

  const [files, setFiles] = useState<(File | undefined)[]>(
    Array(4).fill(undefined)
  );

  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      title: product?.title || "",
      status:
        product?.status === "active" || product?.status === "inactive"
          ? product.status
          : "active",
      code: product?.code || "",
      description: product?.description || "",
      image: product?.image || "",
      units: product?.units || [
        { unit: "", qty: 0, cost: 0, price: 0, wholeSalePrice: 0, level: 1 },
      ],
      category: product?.category || "",
      qtyOnHand: product?.qtyOnHand || 0,
      alertQty: product?.alertQty || 0,
      product_images: product?.product_images || [],
    },
  });

  useEffect(() => {
    // Update form with both existing images and new files
    const formImages = [...existingImages];

    // Add new files to the form data
    const validFiles = files.filter((file) => file !== undefined) as File[];

    const fileUrls = validFiles.map((file) => URL.createObjectURL(file));
    form.setValue("product_images", [...formImages, ...fileUrls]);
  }, [files, existingImages, form]);

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

  // Handle removing an existing image
  const handleRemoveExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  // Handle removing a new file
  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles[index] = undefined;
    setFiles(updatedFiles);
  };

  const handleCreateProduct = async (
    data: z.infer<typeof CreateProductSchema>
  ) => {
    console.log("Form data:", data);

    // Create FormData to handle file uploads if needed
    const formData = new FormData();

    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "product_images") {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add existing images to FormData
    existingImages.forEach((imagePath) => {
      formData.append("existing_images", imagePath);
    });

    // Add new files to FormData
    files.forEach((file) => {
      if (file) {
        formData.append("product_images", file);
      }
    });

    startTransaction(async () => {
      if (isEdit && product) {
        formData.append("productId", product._id);

        const result = await editProduct(formData);
        if (result.success) {
          toast({
            title: "Success",
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

      const result = await createProduct(formData);
      if (result.success) {
        toast({
          title: "Success",
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
          <FormInput name="code" label={t("code")} control={form.control} />
          <FormCombobox
            control={form.control}
            name="category"
            label={t("category")}
            fetchSingleItem={selectedData}
            fetchData={fetchCategories}
            setValue={form.setValue}
          />
          <FormInput name="title" label={t("title")} control={form.control} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            type="number"
            name="alertQty"
            label={t("alertQty")}
            control={form.control}
          />
          <FormSelect
            name="status"
            label={t("status")}
            control={form.control}
            items={statusData}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <FormInput
            type="text"
            name="description"
            label={t("description")}
            control={form.control}
          />
        </div>
        <div>
          <p className="text-base font-medium">Product Images</p>

          {/* Display existing images */}
          {existingImages.length > 0 && (
            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-500 mb-2">Existing Images:</p>
              <div className="flex flex-wrap items-center gap-3">
                {existingImages.map((imagePath, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <Image
                      className="w-24 h-24 object-cover border p-1 rounded"
                      src={imagePath || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload new images */}
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">
              {existingImages.length > 0
                ? "Add More Images:"
                : "Upload Images:"}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {[...Array(4)].map((_, index) => (
                <div key={`upload-${index}`} className="relative">
                  <label htmlFor={`image${index}`}>
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        if (e.target.files && e.target.files.length > 0) {
                          updatedFiles[index] = e.target.files[0];
                          setFiles(updatedFiles);
                        }
                      }}
                      type="file"
                      id={`image${index}`}
                      hidden
                      name={`product_image_${index}`}
                      accept="image/*"
                    />
                    <div className="w-24 h-24 cursor-pointer border p-1 rounded flex items-center justify-center overflow-hidden">
                      {files[index] ? (
                        <Image
                          className="w-full h-full object-cover"
                          src={
                            URL.createObjectURL(files[index]!) ||
                            "/placeholder.svg"
                          }
                          alt=""
                          width={100}
                          height={100}
                        />
                      ) : (
                        <Image
                          className="w-16 h-16 object-contain"
                          src={assets.upload_area || "/placeholder.svg"}
                          alt="Upload"
                          width={64}
                          height={64}
                        />
                      )}
                    </div>
                  </label>
                  {files[index] && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {`Total images: ${existingImages.length + files.filter((f) => f !== undefined).length}/8`}
            </p>
          </div>
        </div>
        <div className="flex">
          <Card>
            <CardHeader>
              <CardTitle>{t("productVariants")}</CardTitle>
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
              <>{isEdit ? t("update") : t("save")}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
