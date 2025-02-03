import clsx from "clsx";
import React, { FC } from "react";

interface CustomTitleProps {
  className?: string;
  content: string;
}

export const CustomTitle: FC<CustomTitleProps> = ({
  content,
  className = "",
}) => {
  return (
    <h1
      className={clsx(
        "m-0 text-[14px] font-semibold leading-[18px] text-black select-text ${className}",
        className
      )}
    >
      {content}
    </h1>
  );
};
