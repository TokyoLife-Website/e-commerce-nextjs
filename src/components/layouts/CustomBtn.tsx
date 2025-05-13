import Link from "next/link";
import React, { ReactNode } from "react";

type ButtonSize = "small" | "medium" | "large";

interface CustomButtonProps {
  href?: string;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  size?: ButtonSize;
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

  const sizeClasses: Record<ButtonSize, string> = {
    small: "p-[9px] text-sm",
    medium: "px-8 py-3 text-base",
    large: "px-10 py-4 text-lg",
  };

  const props: Record<string, any> = {
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
    ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <Comp className={classes} disabled={disabled} {...props} style={style}>
      {children}
    </Comp>
  );
};

export default CustomButton;
