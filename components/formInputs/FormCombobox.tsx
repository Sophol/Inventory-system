import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Control, FieldValues, Path, UseFormSetValue } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface SelectData {
  _id: string;
  title: string | undefined;
}

interface FormComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelClass?: string;
  fetchData: (params: {
    page: number;
    query: string;
    parentId?: string;
  }) => Promise<{ data: SelectData[]; isNext: boolean }>;
  fetchSingleItem: SelectData | null;
  isRequired?: boolean;
  parentId?: string;
  setValue: UseFormSetValue<T>;
}

function FormCombobox<T extends FieldValues>({
  control,
  name,
  label,
  labelClass,
  fetchSingleItem,
  fetchData,
  setValue,
  parentId,
  isRequired = true,
}: FormComboboxProps<T>) {
  const [data, setData] = useState<SelectData[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectData | null>();
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(`${buttonRef.current.offsetWidth}px`);
    }
    if (parentId) {
      handleFetchData(1, "", parentId);
    } else {
      handleFetchData(1, "");
    }
  }, [buttonRef.current, parentId]);

  const handleFetchData = async (
    page: number,
    query: string,
    parentId?: string
  ) => {
    const result = await fetchData({ page, query, parentId });

    setData(result.data);
    setSelectedItem(fetchSingleItem);
    setIsNext(result.isNext);
  };

  const handleSearch = (query: string) => {
    setQuery(query);
    handleFetchData(1, query, parentId);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleFetchData(newPage, query, parentId);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="text-[11px] flex w-full flex-col ">
          <FormLabel className={`text-[11px] text-dark400_light800 ${labelClass}`}>
            {label} {isRequired && <span className="text-primary-500">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                {selectedItem ? (
                  <Button
                    variant="outline"
                    role="combobox"
                    ref={buttonRef}
                    className="text-[12px] h-[28px] justify-between light-border-3 text-dark300_light700 no-focus min-h-[28px] border "
                  >
                    {selectedItem.title}
                    <ChevronDown className="opacity-50" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    role="combobox"
                    ref={buttonRef}
                    className={cn(
                      "text-[10px]  justify-between light-border-3 text-dark300_light700 no-focus min-h-[28px] h-[28px] border",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <div className="flex justify-between items-center w-full ">
                      <span className=" text-[10px]">{field.value ? data.find((item) => item._id === field.value)?.title : ''}</span>
                      <ChevronDown className={`opacity-50 text-[10px]  ${!field.value ? 'ml-auto' : ''}`} />
                    </div>
                  </Button>

                )}
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-full"
              align="start"
              style={{ width: popoverWidth }}
            >
              <Command>
                <CommandInput
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="h-[30px] min-h-[30px] text-[11px]"
                  onInput={(e) => handleSearch(e.currentTarget.value)}
                />
                <CommandList>
                  <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((item) => (
                      <CommandItem
                      className="text-[11px]"
                        value={item.title}
                        key={item._id}
                        onSelect={() => {
                          setValue(name as Path<T>, item._id as any);
                          setSelectedItem(item);
                        }}
                      >
                        {item.title}
                        <Check
                          className={cn(
                            "ml-auto",
                            item._id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="flex justify-between p-2">
                <Button
                  variant="ghost"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!isNext}
                >
                  <ChevronRight />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormCombobox;
