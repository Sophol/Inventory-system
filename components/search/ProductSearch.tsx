"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { getBranches } from "@/lib/actions/branch.action";
import { getCategories } from "@/lib/actions/category.action";
import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import FormCombobox from "../formInputs/FormCombobox";
import FormInput from "../formInputs/FormInput";
import { Button } from "../ui/button";

interface ProductSearchProps {
  route: string;
  otherClasses?: string;
}

const ProductSearch = ({ route, otherClasses }: ProductSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const branchId = searchParams.get("branchId") || "";
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchCategory, setSearchCategory] = useState(categoryId);
  const [searchBranch, setSearchBranch] = useState(branchId);
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
      if (searchCategory) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "categoryId",
          value: searchCategory,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keyToRemove: ["categoryId"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [route, router, pathname, searchCategory, searchParams]);
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
  const form = useForm({
    defaultValues: {
      search: query,
      category: categoryId,
      branch: branchId,
    },
  });

  const handleFetchCategories = async ({
    page,
    query,
  }: {
    page: number;
    query: string;
    parentId?: string;
  }) => {
    const { success, data } = await getCategories({
      page,
      pageSize: 10,
      query,
    });
    return {
      data: success ? data?.categories || [] : [],
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

  const handleCategoryChange = (value: string) => {
    form.setValue("category", value);
    setSearchCategory(value);
  };

  const handleBranchChange = (value: string) => {
    form.setValue("branch", value);
    setSearchBranch(value);
  };

  const handleClearSearch = () => {
    form.reset({
      search: "",
      category: "",
      branch: "",
    });
    setSearchQuery("");
    setSearchCategory("");
    setSearchBranch("");
    const newUrl = removeKeyFromUrlQuery({
      params: searchParams.toString(),
      keyToRemove: ["query", "categoryId", "branchId"],
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
          name="category"
          label="Category"
          // placeholder="Select category"
          fetchSingleItem={null}
          isRequired={false}
          fetchData={handleFetchCategories}
          setValue={(name, value) => {
            form.setValue(name, value);
            handleCategoryChange(value);
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
        <Button
          onClick={handleClearSearch}
             className="w-full sm:w-auto bg-red-600 mt-2 sm:mt-4 text-[11px]  min-h-[26px] h-[26px] "
        >
          Clear Search
        </Button>
      </div>
    </FormProvider>
  );
};

export default ProductSearch;
