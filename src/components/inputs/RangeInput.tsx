import { RangeInputProps } from "@/types/input";
import { Controller, FieldValues } from "react-hook-form";
import CustomLabel from "../layouts/CustomLabel";

const RangeInput = <T extends FieldValues>({
  name,
  control,
  label,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  isRequired = false,
}: RangeInputProps<T>) => {
  const marks = [0, 25, 50, 75, 100];
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const safeValue = Math.min(Math.max(Number(value), 0), 100);
        return (
          <div className="relative mb-6">
            {label && <CustomLabel label={label} isRequired={isRequired} />}{" "}
            {safeValue}%
            <input
              id={name}
              type="range"
              {...field}
              onChange={(e) => onChange(Number(e.target.value))}
              value={safeValue}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="relative w-full">
              {marks.map((mark, index) => (
                <span
                  key={mark}
                  className="text-sm text-gray-500 dark:text-gray-400 absolute -bottom-6"
                  style={{
                    left: `${(index / (marks.length - 1)) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {mark}%
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
};

export default RangeInput;
