import React from "react";
import fakeCategories from "@/app/data/categoty";
import { CategoryItem } from "./CategoryItem";

export const CategoryList = () => {
  return (
    <div className="bg-white shadow-lg">
      <ul className="max-w-[1200px] z-10 relative h-16 mx-auto flex items-center justify-center">
        {fakeCategories.map((cateItem, idx) => (
          <CategoryItem key={idx} cateItem={cateItem} />
        ))}
      </ul>
    </div>
  );
};
