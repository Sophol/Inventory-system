"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import FormSelect from "../formInputs/FormSelect";
import { getYearOptions } from "@/lib/utils";

interface ProductSearchProps {
  route: string;
  otherClasses?: string;
}

const ProductQRSearch = ({ route, otherClasses }: ProductSearchProps) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const isPrint = searchParams.get("isPrint") || "false";
  const generatedYear = searchParams.get("generatedYear") || "";
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchStatus, setSearchStatus] = useState(status);
  const [searchIsPrint, setSearchIsPrint] = useState(isPrint);
  const [searchGeneratedYear, setSearchGeneratedYear] = useState(generatedYear);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, route, router, searchParams, pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchStatus) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "status",
          value: searchStatus,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["status"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchStatus, searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchIsPrint) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "isPrint",
          value: searchIsPrint,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["isPrint"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchIsPrint, searchParams]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchGeneratedYear) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "generatedYear",
          value: searchGeneratedYear,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["generatedYear"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchGeneratedYear, searchParams]);

  const form = useForm({
    defaultValues: {
      search: query,
      status: status,
      isPrint: isPrint,
      generatedYear: generatedYear,
    },
  });

  const handleStatusChange = (value: string) => {
    form.setValue("status", value);
    setSearchStatus(value);
  };
  const handleIsPrintChange = (value: string) => {
    form.setValue("isPrint", value);
    setSearchIsPrint(value);
  };
  const handleGeneratedYearChange = (value: string) => {
    form.setValue("generatedYear", value);
    setSearchGeneratedYear(value);
  };
  const statusData = [
    { _id: "1", title: "Active" },
    { _id: "0", title: "Inactive" },
  ];
  const isPrintData = [
    { _id: "all", title: "All" },
    { _id: "true", title: "True" },
    { _id: "false", title: "False" },
  ];
  const generatedYearData = getYearOptions();
  const handleClearSearch = () => {
    form.reset({
      search: "",
      status: "",
      isPrint: "",
      generatedYear: "",
    });
    setSearchQuery("");
    setSearchStatus("");
    setSearchIsPrint("all");
    setSearchGeneratedYear("");

    handleStatusChange("");
    handleIsPrintChange("all");
    handleGeneratedYearChange("");
    const newUrl = removeKeyFromUrlQuery({
      params: searchParams.toString(),
      keyToRemove: ["query", "status", "generatedYear"],
    });
    router.push(newUrl, { scroll: false });
  };
  const handleExportExcel = async () => {
    const params = {
      pageNumber: 100000, // Export all records
      query: query,
      status: status === "" ? undefined : Number(status),
      is_printed:
        isPrint === "true" ? true : isPrint === "false" ? false : undefined,
      generated_year: generatedYear ? Number(generatedYear) : undefined,
    };

    setLoading(true);
    try {
      const response = await fetch("/api/export-product-qrs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error("Failed to export Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "product_qrs.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      // Revalidate the path to ensure the latest data is fetched
      window.location.reload();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div
        className={`flex flex-wrap sm:flex-nowrap items-center gap-2 min-h-[36px] rounded-[10px] ${otherClasses}`}
      >
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-grow">
          <FormInput
            name="search"
            label={t("search")}
            control={form.control}
            isRequired={false}
            onChange={() => {
              setSearchQuery(form.getValues("search"));
            }}
          />
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <FormSelect
              name="status"
              label={t("status")}
              control={form.control}
              items={statusData}
              onChange={(value: string) => {
                setSearchStatus(value);
              }}
            />
            <FormSelect
              name="isPrint"
              label={t("is_print")}
              control={form.control}
              items={isPrintData}
              onChange={(value: string) => {
                setSearchIsPrint(value);
              }}
            />
            <FormSelect
              name="generatedYear"
              label={t("generated_year")}
              control={form.control}
              items={generatedYearData}
              onChange={(value: string) => {
                setSearchGeneratedYear(value);
              }}
            />
          </div>

          <Button
            onClick={handleClearSearch}
            className="w-full sm:w-auto bg-red-600 mt-1 sm:mt-4 text-[11px]  min-h-[26px] h-[26px]"
          >
            {t("clearSearch")}
          </Button>
        </div>
        {/* Export Button */}
        <Button
          onClick={handleExportExcel}
          disabled={loading}
          className="w-full sm:w-auto bg-green-600 mt-1 sm:mt-4 text-[11px] min-h-[26px] h-[26px]"
        >
          {loading ? "Exporting..." : "Export to Excel"}
        </Button>
      </div>
    </FormProvider>
  );
};

export default ProductQRSearch;
