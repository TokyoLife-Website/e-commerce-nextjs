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
      className={`m-0 text-[14px] font-semibold leading-[18px] text-black select-text ${className}`}
    >
      {content}
    </h1>
  );
};
