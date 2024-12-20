"use client";
import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

const filters = [
  { name: "React", value: "React" },
  { name: "Javascript", value: "Javascript" },
  //   { name: "Newest", value: "newest" },
  //   { name: "Popular", value: "popular" },
  //   { name: "Unanswered", value: "unanswered" },
  //   { name: "Recommended", value: "recommended" },
];
const HomeFilter = () => {
  let newUrl = "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramFilter = searchParams.get("filter");
  const [active, setActive] = useState(paramFilter || "");
  const handleClick = (filter: string) => {
    if (filter === active) {
      setActive("");
      newUrl = removeKeyFromUrlQuery({
        params: searchParams.toString(),
        keyToRemove: ["filter"],
      });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          className={cn(
            `body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
            active === filter.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 hover:dark:bg-dark-300"
          )}
          onClick={() => handleClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};
export default HomeFilter;
