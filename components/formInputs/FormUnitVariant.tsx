"use client";
import { Trash2 } from "lucide-react";
import React from "react";
import { useFieldArray } from "react-hook-form";
import FormCombobox from "../formInputs/FormCombobox";
import { Button } from "../ui/button";
import FormInput from "./FormInput";
interface FormUnitVariantProps {
  control: any;
  setValue: any;
  fetchUnits: (params: {
    page: number;
    query: string;
  }) => Promise<{ data: SelectData[]; isNext: boolean }>;
}

const FormUnitVariant: React.FC<FormUnitVariantProps> = ({
  control,
  setValue,
  fetchUnits,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "units",
  });

  return (
    <div className="flex flex-col gap-2 justify-start">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <FormCombobox
              control={control}
              name={`units.${index}.unit`}
              label="Unit"
              placeholder="Select unit"
              fetchData={fetchUnits}
              setValue={setValue}
            />
            <FormInput
              type="number"
              name={`units.${index}.qty`}
              label="Qty"
              control={control}
            />
            <FormInput
              type="number"
              name={`units.${index}.cost`}
              label="Cost"
              control={control}
            />
            <FormInput
              type="number"
              name={`units.${index}.price`}
              label="Price"
              control={control}
            />
            <FormInput
              type="number"
              name={`units.${index}.wholeSalePrice`}
              label="WholeSalePrice"
              control={control}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              disabled={index === 0}
              className="mt-7"
            >
              <Trash2 className="text-red-500" />
            </Button>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-start">
        <Button
          type="button"
          className="body-medium bg-green-600 hover:bg-green-500"
          onClick={() =>
            fields.length < 3 &&
            append({ unit: "", qty: 0, cost: 0, price: 0, wholeSalePrice: 0 })
          }
          disabled={fields.length >= 3}
        >
          Add Unit
        </Button>
      </div>
    </div>
  );
};

export default FormUnitVariant;
