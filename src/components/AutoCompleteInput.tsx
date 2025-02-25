import { FormHelperText, Stack, TextField } from "@mui/material";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import CustomLabel from "./CustomLabel";
import { AutoCompleteInputProps } from "@/types/input";
import Autocomplete from "@mui/material/Autocomplete";

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
            onChange={(_, newValue) => onChange(newValue?.id ?? 0)}
            value={options.find((option) => option.id === value) || null}
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
