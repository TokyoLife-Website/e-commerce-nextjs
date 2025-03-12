import { FormControl, FormHelperText, Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { DateInputProps } from "@/types/input";
import CustomLabel from "../layouts/CustomLabel";

const DateInput = <T extends FieldValues>({
  name,
  label,
  control,
  isError,
  errMsg,
  size = "medium",
  disabledFuture = false,
  disabledPast = false,
  isRequired = false,
}: DateInputProps<T>) => {
  return (
    <FormControl error={isError} fullWidth>
      <Stack spacing={0.5}>
        {label && <CustomLabel label={label} isRequired={isRequired} />}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                disableFuture={disabledFuture}
                disablePast={disabledPast}
                value={field.value ? dayjs(field.value) : null}
                inputRef={field.ref}
                onChange={(date) => {
                  field.onChange(date ? dayjs(date).toDate() : null);
                }}
                slotProps={{
                  textField: {
                    color: "success",
                    error: isError,
                    size,
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />
      </Stack>
      <FormHelperText sx={{ marginLeft: 0, marginRight: 0 }}>
        {errMsg}
      </FormHelperText>
    </FormControl>
  );
};

export default DateInput;
