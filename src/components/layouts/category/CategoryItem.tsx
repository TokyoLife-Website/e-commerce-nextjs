import { Category } from "@/app/data/categoty";
import Link from "next/link";
import React, { FC } from "react";

interface CategoryItemProps {
  cateItem: Category;
}

export const CategoryItem: FC<CategoryItemProps> = ({ cateItem }) => {
  return (
    <li
      key={cateItem.name}
      className="group h-full cursor-pointer justify-center px-5 list-none text-[14px] font-bold leading-[18px] text-black select-text hover:text-primary inline-flex items-center"
    >
      {cateItem.name}
      <div className="absolute top-full left-0 w-full z-50 hidden group-hover:block">
        <div className="px-5 py-6 bg-white shadow-custom">
          <div className="flex-wrap flex flex-row gap-y-4">
            {cateItem.subcategories.map((subCateItem, idx) => (
              <div
                key={idx}
                className="basis-[25%] flex flex-col items-start gap-4"
              >
                <div className="text-[14px] font-bold leading-[18px] text-black select-text hover:text-primary w-full">
                  {subCateItem.name}
                </div>
                {subCateItem?.subcategories &&
                  subCateItem.subcategories.map((item, idx) => (
                    <Link
                      key={idx}
                      href={"/"}
                      className="text-black font-normal select-text hover:text-primary w-full"
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};
