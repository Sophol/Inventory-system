"use client";
import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormInput from "../formInputs/FormInput";

interface ProductSearchProps {
  control: any;
  setValue: any;
  route: string;
  otherClasses: string;
  fetchCategory: (params: {
    page: number;
    query: string;
  }) => Promise<{ data: SelectData[]; isNext: boolean }>;
}

const LocalSearch = ({
  control,
  setValue,
  route,
  otherClasses,
  fetchCategory,
}: ProductSearchProps) => {
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
  return (
    <div className={`flex min-h-[36px] rounded-[10px] ${otherClasses}`}>
      <FormInput
        name="search"
        label="Search"
        control={control}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
    </div>
  );
};
export default LocalSearch;
