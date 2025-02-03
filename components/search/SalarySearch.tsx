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
import { getStaffs } from "@/lib/actions/user.action";

interface ProductSearchProps {
  route: string;
  otherClasses?: string;
}

const SalarySearch = ({ route, otherClasses }: ProductSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const staffId = searchParams.get("staffId") || "";
  const branchId = searchParams.get("branchId") || "";
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchStaff, setSearchStaff] = useState(staffId);
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
      if (searchStaff) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "staffId",
          value: searchStaff,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["staffId"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchStaff, searchParams]);

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
      staffId: staffId,
      branch: branchId,
    },
  });

  const handleFetchStaffs = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
    parentId?: string;
  }) => {
    const { success, data } = await getStaffs({
      page,
      pageSize: 10,
      query,
    });
    return {
      data: success
        ? data?.users.map((user: User) => ({
            _id: user._id,
            title: user.name,
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

  const handleStaffChange = (value: string) => {
    form.setValue("staffId", value);
    setSearchStaff(value);
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
      staffId: "",
      branch: "",
    });
    setSearchQuery("");
    setSearchStaff("");
    setSearchBranch("");
    setDateRange(undefined);
    setResetData(true);

    const newUrl = removeKeyFromUrlQuery({
      params: searchParams.toString(),
      keyToRemove: ["query", "staffId", "branchId", "dateRange"],
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <FormProvider {...form}>
      <div className={`flex flex-wrap sm:flex-nowrap items-center gap-3 min-h-[36px] rounded-[10px] ${otherClasses}`}>
        <FormInput
          name="search"
          label="Search"
          control={form.control}
          isRequired={false}
          onChange={() => {
            setSearchQuery(form.getValues("search"));
          }}
        />
             <div className="flex flex-col sm:flex-row sm:gap-3 w-full">
        <FormCombobox
          control={form.control}
          name="staffId"
          label="Staff"
          // placeholder="Select Staff"
          fetchSingleItem={null}
          isRequired={false}
          fetchData={handleFetchStaffs}
          setValue={(name, value) => {
            form.setValue(name, value);
            handleStaffChange(value);
          }}
        />
        <FormCombobox
          control={form.control}
          name="branch"
          label="Branch"
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
          className="w-full sm:w-auto bg-red-600 mt-2 sm:mt-7 "
        >
          Clear Search
        </Button>
      </div>
    </FormProvider>
  );
};

export default SalarySearch;
