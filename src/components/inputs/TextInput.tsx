import { Stack, TextField } from "@mui/material";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { TextInputProps } from "@/types/input";
import CustomLabel from "../layouts/CustomLabel";

const TextInput = <T extends FieldValues>({
  name,
  control,
  label,
  isError,
  errMsg,
  type = "text",
  isRequired = false,
  placeHolder,
  size = "medium",
  disabled = false,
}: TextInputProps<T>) => {
  return (
    <div>
      <Stack spacing={0.5}>
        {label && <CustomLabel label={label} isRequired={isRequired} />}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <TextField
              hiddenLabel
              placeholder={placeHolder || label}
              {...field}
              color="success"
              fullWidth
              margin="normal"
              error={isError}
              helperText={errMsg}
              type={type}
              disabled={disabled}
              onChange={(e) =>
                field.onChange(
                  type === "number"
                    ? Math.max(+e.target.value, 0)
                    : e.target.value
                )
              }
              size={size}
              slotProps={{ formHelperText: { sx: { marginLeft: 0 } } }}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default TextInput;
