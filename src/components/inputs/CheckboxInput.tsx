import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { CheckBoxProps } from "@/types/input";

const CheckboxInput = <T extends FieldValues>({
  id,
  name,
  control,
  isChecked,
}: CheckBoxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          id={id}
          type="checkbox"
          {...field}
          checked={field.value}
          // defaultChecked={isChecked}
          className="w-4 h-4 border-gray-300 rounded cursor-pointer"
        />
      )}
    />
  );
};

export default CheckboxInput;
