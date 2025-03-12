import { Controller, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { RadioInputProps } from "@/types/input";
import CustomLabel from "../layouts/CustomLabel";

const RadioInput = <T extends FieldValues>({
  name,
  control,
  label,
  isError,
  errMsg,
  options,
  disabled = false,
  isRequired = false,
}: RadioInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Stack spacing={0.5}>
          {label && <CustomLabel label={label} isRequired={isRequired} />}
          <FormControl component="fieldset" error={isError} disabled={disabled}>
            <RadioGroup row {...field} className="flex justify-around">
              {options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.name}
                />
              ))}
            </RadioGroup>
            {isError && <FormHelperText>{errMsg}</FormHelperText>}
          </FormControl>
        </Stack>
      )}
    />
  );
};

export default RadioInput;
