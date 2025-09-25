import { Category } from "@/types/category";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface CategoryItemProps {
  cateItem: Category;
}

export const CategoryItem: FC<CategoryItemProps> = ({ cateItem }) => {
  const router = useRouter();
  return (
    <li
      key={cateItem.name}
      onClick={() => router.push(`/danh-muc-san-pham/${cateItem.slug}`)}
      className="group h-full cursor-pointer justify-center px-5 list-none text-[14px] font-bold leading-[18px] text-black select-text hover:text-primary inline-flex items-center"
    >
      {cateItem.name}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-full left-0 w-full z-50 hidden group-hover:block"
      >
        {cateItem.children && cateItem.children.length && (
          <div className="px-5 py-6 bg-white shadow-custom">
            <div className="flex-wrap flex flex-row gap-y-4">
              {cateItem.children.map((subCateItem, idx) => (
                <div
                  key={idx}
                  className="basis-[25%] flex flex-col items-start gap-4"
                >
                  <Link
                    href={`/danh-muc-san-pham/${subCateItem.slug}`}
                    className="text-[14px] font-bold leading-[18px] text-black select-text hover:text-primary w-full"
                  >
                    {subCateItem.name}
                  </Link>
                  {subCateItem?.children &&
                    subCateItem.children.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/danh-muc-san-pham/${item.slug}`}
                        className="text-black font-normal select-text hover:text-primary w-full"
                      >
                        {item.name}
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};
