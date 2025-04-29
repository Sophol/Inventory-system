"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { getBranches } from "@/lib/actions/branch.action";
import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import FormCombobox from "../formInputs/FormCombobox";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { getSuppliers } from "@/lib/actions/supplier.action";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";

interface ProductSearchProps {
  route: string;
  otherClasses?: string;
}

const PurchaseSearch = ({ route, otherClasses }: ProductSearchProps) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const supplierId = searchParams.get("supplierId") || "";
  const branchId = searchParams.get("branchId") || "";
  const customerId = searchParams.get("customerId") || "";
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchSupplier, setSearchSupplier] = useState(supplierId);
  const [searchBranch, setSearchBranch] = useState(branchId);
  const [searchCustomer, setSearchCustomer] = useState(customerId);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [resetData, setResetData] = useState(false);

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
      if (searchSupplier) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "supplierId",
          value: searchSupplier,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["supplierId"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchSupplier, searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchBranch) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "branchId",
          value: searchBranch,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["branchId"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchBranch, searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchCustomer) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "customerId",
          value: searchCustomer,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["customerId"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchCustomer, searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (dateRange) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "dateRange",
          value: `${dateRange.from?.toISOString()}_${dateRange.to?.toISOString()}`,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["dateRange"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [dateRange, route, router, searchParams, pathname]);

  const form = useForm({
    defaultValues: {
      search: query,
      supplier: supplierId,
      branch: branchId,
      customer: customerId,
    },
  });

  const handleFetchSuppliers = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
    parentId?: string;
  }) => {
    const { success, data } = await getSuppliers({
      page,
      pageSize: 10,
      query,
    });
    return {
      data: success
        ? data?.suppliers.map((supplier: Supplier) => ({
            _id: supplier._id,
            title: supplier.name,
          })) || []
        : [],
      isNext: data?.isNext || false,
    };
  };

  const handleFetchBranches = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
    parentId?: string;
  }) => {
    const { success, data } = await getBranches({ page, pageSize: 10, query });
    return {
      data: success ? data?.branches || [] : [],
      isNext: data?.isNext || false,
    };
  };

  const handleSupplierChange = (value: string) => {
    form.setValue("supplier", value);
    setSearchSupplier(value);
  };

  const handleBranchChange = (value: string) => {
    form.setValue("branch", value);
    setSearchBranch(value);
  };

  const handleDateRangeChange = (date: DateRange | undefined) => {
    setDateRange(date);
    setResetData(false);
  };

  const handleClearSearch = () => {
    form.reset({
      search: "",
      supplier: "",
      branch: "",
      customer: "",
    });
    setSearchQuery("");
    setSearchSupplier("");
    setSearchBranch("");
    setSearchCustomer("");
    setDateRange(undefined);
    setResetData(true);
    const newUrl = removeKeyFromUrlQuery({
      params: searchParams.toString(),
      keyToRemove: [
        "query",
        "supplierId",
        "branchId",
        "customerId",
        "dateRange",
        "pageSize",
        "page",
      ],
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <FormProvider {...form}>
      <div
        className={`flex flex-wrap sm:flex-nowrap items-center gap-2 min-h-[36px] rounded-[10px] ${otherClasses}`}
      >
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
          <FormCombobox
            control={form.control}
            name="supplier"
            label={t("supplier")}
            // placeholder="Select Supplier"
            fetchSingleItem={null}
            isRequired={false}
            fetchData={handleFetchSuppliers}
            setValue={(name, value) => {
              form.setValue(name, value);
              handleSupplierChange(value);
            }}
          />
          <FormCombobox
            control={form.control}
            name="branch"
            label={t("branch")}
            // placeholder="Select branch"
            fetchSingleItem={null}
            isRequired={false}
            fetchData={handleFetchBranches}
            setValue={(name, value) => {
              form.setValue(name, value);
              handleBranchChange(value);
            }}
          />
        </div>
        <DatePickerWithRange
          onDateChange={handleDateRangeChange}
          reset={resetData}
          className="w-full sm:w-auto"
        />
        <Button
          onClick={handleClearSearch}
          className="w-full sm:w-auto bg-red-600 mt-1 sm:mt-4 text-[11px]  min-h-[26px] h-[26px]"
        >
          {t("clearSearch")}
        </Button>
      </div>
    </FormProvider>
  );
};

export default PurchaseSearch;
