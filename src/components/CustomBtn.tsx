import Link from "next/link";
import React, { ReactNode } from "react";

interface CustomButtonProps {
  href?: string;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  size?: string;
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  href,
  className = "",
  children,
  style,
  size = "medium",
  disabled = false,
  onClick = () => {},
  ...rest
}) => {
  let Comp: React.ElementType = "button";

  const sizeClasses = {
    small: "p-[9px] text-sm",
    medium: "px-8 py-3 text-base", // Default size
    large: "px-10 py-4 text-lg",
  };

  const props = {
    href,
    onClick,
    ...rest,
  };

  if (disabled) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  if (href) {
    Comp = Link;
    props.href = href;
  }

  const classes = `bg-primary min-w-[140px] font-bold rounded w-fit 
    ${sizeClasses[size]}
   ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""} `;

  return (
    <Comp className={classes} disabled={disabled} {...props} style={style}>
      {children}
    </Comp>
  );
};

export default CustomButton;
