import { FormHelperText, Stack, TextField } from "@mui/material";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { AutoCompleteInputProps } from "@/types/input";
import Autocomplete from "@mui/material/Autocomplete";
import CustomLabel from "../layouts/CustomLabel";

const AutoCompleteInput = <T extends FieldValues>({
  name,
  control,
  label,
  isError,
  errMsg,
  options,
  disabled = false,
  size = "medium",
  isRequired = false,
  placeHolder,
  defaultValue,
  disableClearable = false,
}: AutoCompleteInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Stack spacing={0.5}>
          {label && <CustomLabel label={label} isRequired={isRequired} />}
          <Autocomplete
            disableClearable={disableClearable}
            options={options}
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, newValue) => onChange(newValue?.id ?? defaultValue)}
            value={
              options.find((option) => option.id === value) || defaultValue
            }
            disabled={disabled}
            size={size}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeHolder || label}
                error={isError}
              />
            )}
          />
          {isError && errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
        </Stack>
      )}
    />
  );
};

export default AutoCompleteInput;
