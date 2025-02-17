"use client";
import React from "react";
import { CategoryItem } from "./CategoryItem";
import { useCategoriesQuery } from "@/hooks/api/category.api";

export const CategoryList = () => {
  const { data, isLoading } = useCategoriesQuery();

  if (isLoading) return;

  return (
    <div className="bg-white shadow-lg">
      <ul className="max-w-[1200px] z-10 relative h-16 mx-auto flex items-center justify-center">
        {data?.data.map((cateItem, idx) => (
          <CategoryItem key={idx} cateItem={cateItem} />
        ))}
      </ul>
    </div>
  );
};
