"use client";

import { Trash2 } from "lucide-react";
import React from "react";
import {
  useFieldArray,
  Control,
  FieldValues,
  UseFormSetValue,
  Path,
  ArrayPath,
} from "react-hook-form";

import FormInput from "./FormInput";
import FormCombobox from "../formInputs/FormCombobox";
import { Button } from "../ui/button";

interface SelectData {
  _id: string;
  title: string | undefined;
}

type FormUnitVariantProps<T extends FieldValues> = {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  fetchUnits: (params: {
    page: number;
    query: string;
  }) => Promise<{ data: SelectData[]; isNext: boolean }>;
  name: ArrayPath<T>;
};

function FormUnitVariant<T extends FieldValues>({
  control,
  setValue,
  fetchUnits,
  name,
}: FormUnitVariantProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="flex flex-col gap-2 justify-start">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {fields.map((field, index) => {
          const selectedData = {
            _id: (field as any).unit,
            title: (field as any).unitTitle,
          };
          return (
            <React.Fragment key={field.id}>
              <FormCombobox
                control={control}
                name={`${name}.${index}.unit` as Path<T>}
                label="Unit"
                placeholder="Select unit"
                fetchSingleItem={selectedData}
                fetchData={fetchUnits}
                setValue={setValue}
              />
              <FormInput
                type="number"
                name={`${name}.${index}.qty` as Path<T>}
                label="Qty"
                control={control}
              />
              <FormInput
                type="number"
                name={`${name}.${index}.cost` as Path<T>}
                label="Cost"
                control={control}
              />
              <FormInput
                type="number"
                name={`${name}.${index}.price` as Path<T>}
                label="Price"
                control={control}
              />
              <FormInput
                type="number"
                name={`${name}.${index}.wholeSalePrice` as Path<T>}
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
          );
        })}
      </div>
      <div className="flex justify-start">
        <Button
          type="button"
          className="body-medium bg-green-600 hover:bg-green-500"
          onClick={() =>
            fields.length < 3 &&
            append({
              unit: "",
              qty: 0,
              cost: 0,
              price: 0,
              wholeSalePrice: 0,
            } as any)
          }
          disabled={fields.length >= 3}
        >
          Add Unit
        </Button>
      </div>
    </div>
  );
}

export default FormUnitVariant;
