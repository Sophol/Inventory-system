"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { getBranches } from "@/lib/actions/branch.action";
import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import FormCombobox from "../formInputs/FormCombobox";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { getCustomers } from "@/lib/actions/customer.action";
import { useTranslations } from "next-intl";

interface ProductSearchProps {
  route: string;
  otherClasses?: string;
}

const SaleSearch = ({ route, otherClasses }: ProductSearchProps) => {
  const t = useTranslations("erp");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const customerId = searchParams.get("customerId") || "";
  const branchId = searchParams.get("branchId") || "";
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchCustomer, setSearchCustomer] = useState(customerId);
  const [searchBranch, setSearchBranch] = useState(branchId);
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
      customer: customerId,
      branch: branchId,
    },
  });

  const handleFetchCustomers = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
    parentId?: string;
  }) => {
    const { success, data } = await getCustomers({
      page,
      pageSize: 10,
      query,
    });
    return {
      data: success
        ? data?.customers.map((customer: Customer) => ({
            _id: customer._id,
            title: customer.name,
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

  const handleCustomerChange = (value: string) => {
    form.setValue("customer", value);
    setSearchCustomer(value);
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
      customer: "",
      branch: "",
    });
    setSearchQuery("");
    setSearchCustomer("");
    setSearchBranch("");
    setDateRange(undefined);
    setResetData(true);
    const newUrl = removeKeyFromUrlQuery({
      params: searchParams.toString(),
      keyToRemove: ["query", "customerId", "branchId", "dateRange"],
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <FormProvider {...form}>
      <div
        className={`flex text-[11px] flex-wrap sm:flex-nowrap items-center gap-2 min-h-[30px] rounded-sm ${otherClasses}`}
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
            name="customer"
            label={t("customer")}
            fetchSingleItem={null}
            isRequired={false}
            fetchData={handleFetchCustomers}
            setValue={(name, value) => {
              form.setValue(name, value);
              handleCustomerChange(value);
            }}
          />
          <FormCombobox
            control={form.control}
            name="branch"
            label={t("branch")}
            labelClass="mt-3 sm:mt-0"
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
          className="w-full sm:w-auto text-[11px] "
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

export default SaleSearch;
