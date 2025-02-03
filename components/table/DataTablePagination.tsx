"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/url";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  isNext: boolean | undefined;
  totalCount?: number;
}

export function DataTablePagination<TData>({
  table,
  isNext,
  totalCount = 0,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const currentPage = page ? parseInt(page) : 1;
  const currentPageSize = pageSize ? parseInt(pageSize) : 10;
  const pageCount = Math.ceil(totalCount / currentPageSize);
  const handleNavigation = (type: string) => {
    const nextPageNumber = type === "prev" ? currentPage - 1 : currentPage + 1;

    const value = nextPageNumber > 1 ? nextPageNumber.toString() : "";

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: value,
    });

    router.push(newUrl);
  };

  const handlePageSizeChange = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "pageSize",
      value: value,
    });

    router.push(newUrl);
    table.setPageSize(Number(value));
  };
  const startEntry = (currentPage - 1) * currentPageSize + 1;
  const endEntry = Math.min(currentPage * currentPageSize, totalCount);
  return (
    <div className="flex items-center justify-between px-2 mt-5">
      <div className="hidden sm:flex flex-1 text-sm text-muted-foreground">
        Showing {startEntry} to {endEntry} of {totalCount} entries
      </div>
      {(isNext || currentPage > 1 || currentPageSize >= 10) && (
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${currentPageSize}`}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={currentPageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handleNavigation("prev")}
              disabled={currentPage == 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handleNavigation("next")}
              disabled={!isNext}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
