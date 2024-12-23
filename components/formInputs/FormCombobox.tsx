import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Control, UseFormSetValue } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ComboboxProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  setValue: UseFormSetValue<any>;
  fetchData: (params: {
    page: number;
    query: string;
  }) => Promise<{ data: SelectData[]; isNext: boolean }>;
  isRequired?: boolean;
}

const FormCombobox: React.FC<ComboboxProps> = ({
  control,
  name,
  label,
  placeholder,
  setValue,
  fetchData,
  isRequired = true,
}) => {
  const [data, setData] = useState<SelectData[]>([]);
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (buttonRef.current) {
      setPopoverWidth(`${buttonRef.current.offsetWidth}px`);
    }
    handleFetchData(1, "");
  }, [buttonRef.current]);

  const handleFetchData = async (page: number, query: string) => {
    const result = await fetchData({ page, query });
    setData(result.data);
    setIsNext(result.isNext);
  };

  const handleSearch = (query: string) => {
    setQuery(query);
    handleFetchData(1, query);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleFetchData(newPage, query);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="paragraph-semibold text-dark400_light800">
            {label} {isRequired && <span className="text-primary-500">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  ref={buttonRef}
                  className={cn(
                    "paragraph-regular justify-between background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[36px] border",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? data.find((item) => item._id === field.value)?.title
                    : placeholder}
                  <ChevronDown className="opacity-50" />
                </Button>
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
                  className="h-9"
                  onInput={(e) => handleSearch(e.currentTarget.value)}
                />
                <CommandList>
                  <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((item) => (
                      <CommandItem
                        value={item.title}
                        key={item._id}
                        onSelect={() => {
                          setValue(name, item._id);
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
        </FormItem>
      )}
    />
  );
};

export default FormCombobox;
