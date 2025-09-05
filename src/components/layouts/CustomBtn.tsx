import Link from "next/link";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant = "primary" | "secondary" | "outline";

interface CustomButtonProps {
  href?: string;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  size?: ButtonSize;
  variant?: ButtonVariant;
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
  variant = "primary",
  disabled = false,
  onClick,
  ...rest
}) => {
  let Comp: React.ElementType = "button";

  const sizeClasses: Record<ButtonSize, string> = {
    small: "p-[9px] text-sm",
    medium: "px-8 py-3 text-base",
    large: "px-10 py-4 text-lg",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  };

  const baseClasses =
    "text-center min-w-[140px] font-bold rounded w-fit inline-block transition-all ease-in-out hover:shadow-xl duration-300";
  const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";

  const props: Record<string, any> = {
    href,
    onClick,
    type: href ? undefined : "button", // Đảm bảo button không có href có type="button"
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

  const classes = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabled && disabledClasses,
    className
  );

  return (
    <Comp className={classes} disabled={disabled} {...props} style={style}>
      {children}
    </Comp>
  );
};

export default CustomButton;
