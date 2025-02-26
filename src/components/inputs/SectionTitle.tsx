import Image from "next/image";
import React, { FC } from "react";

interface SectionTitleProps {
  title: string;
}

export const SectionTitle: FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className="mb-6 flex items-center text-2xl leading-[30px] font-bold justify-center gap-7 uppercase text-primary text-center">
      <Image
        src="/flower.svg"
        alt="Next.js logo"
        width={20}
        height={20}
        priority
      />
      {title}
      <Image
        src="/flower.svg"
        alt="Next.js logo"
        width={20}
        height={20}
        priority
      />
    </div>
  );
};
