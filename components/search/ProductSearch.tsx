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
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);

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

  const form = useForm();

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
    if (value) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "categoryId",
        value,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  const handleBranchChange = (value: string) => {
    if (value) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "branchId",
        value,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  const handleClearSearch = () => {
    form.reset({
      search: "",
      category: "",
      branch: "",
    });
    setSearchQuery("");
    const newUrl = removeKeyFromUrlQuery({
      params: searchParams.toString(),
      keyToRemove: ["query", "categoryId", "branchId"],
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <FormProvider {...form}>
      <div className={`flex min-h-[36px] gap-3 rounded-[10px] ${otherClasses}`}>
        <FormInput
          name="search"
          label="Search"
          control={form.control}
          isRequired={false}
          onChange={() => {
            setSearchQuery(form.getValues("search"));
          }}
        />
        <FormCombobox
          control={form.control}
          name="category"
          label="Category"
          placeholder="Select category"
          keyRemove="categoryId"
          fetchSingleItem={null}
          isRequired={false}
          fetchData={handleFetchCategories}
          setValue={(name, value) => {
            form.setValue(name, value);
            if (value) handleCategoryChange(value);
          }}
        />
        <FormCombobox
          control={form.control}
          name="branch"
          label="Branch"
          keyRemove="branchId"
          placeholder="Select branch"
          fetchSingleItem={null}
          isRequired={false}
          fetchData={handleFetchBranches}
          setValue={(name, value) => {
            form.setValue(name, value);
            handleBranchChange(value);
          }}
        />
        <Button
          onClick={handleClearSearch}
          className="ml-2 mt-[30px] bg-red-600"
        >
          Clear Search
        </Button>
      </div>
    </FormProvider>
  );
};

export default ProductSearch;
