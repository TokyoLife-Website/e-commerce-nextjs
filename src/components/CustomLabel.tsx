interface CustomLabelProps {
  label: string;
  isRequired?: boolean;
}

import { Typography } from "@mui/material";
import React from "react";

const CustomLabel: React.FC<CustomLabelProps> = ({
  label,
  isRequired = false,
}) => {
  return (
    <label className="font-bold text-xs flex items-center leading-4 mb-2">
      {label}
      {isRequired && <span className="text-primary ml-1">*</span>}
    </label>
  );
};

export default CustomLabel;
