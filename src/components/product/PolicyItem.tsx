import React, { FC } from "react";

export interface PolicyItemType {
  icon: React.ReactNode;
  text: string;
}

export const PolicyItem: FC<PolicyItemType> = ({ icon, text }) => {
  return (
    <div className="w-1/3 text-center">
      <div className="h-[35px] mb-[15px] flex justify-center">{icon}</div>
      <p className="leading-[18px]">{text}</p>
    </div>
  );
};
