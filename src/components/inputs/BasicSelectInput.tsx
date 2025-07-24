import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import React from "react";
import CustomLabel from "../layouts/CustomLabel";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type BasicOption = {
  id: string | number;
  name: string;
};

type BasicSelectInputProps = {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  isError?: boolean;
  errMsg?: string;
  options: BasicOption[];
  disabled?: boolean;
  size?: "small" | "medium";
  isRequired?: boolean;
  placeHolder?: string;
};

const BasicSelectInput = ({
  label,
  value,
  onChange,
  isError,
  errMsg,
  options,
  disabled = false,
  size = "medium",
  isRequired = false,
  placeHolder,
}: BasicSelectInputProps) => {
  return (
    <Stack spacing={0.5}>
      {label && <CustomLabel label={label} isRequired={isRequired} />}
      <FormControl size={size} fullWidth color="success" error={isError}>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          disabled={disabled}
          MenuProps={MenuProps}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <span style={{ color: "#aaa" }}>{placeHolder || label}</span>
              );
            }
            return (
              options.find((option) => option.id === selected)?.name || selected
            );
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{errMsg}</FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default BasicSelectInput;
