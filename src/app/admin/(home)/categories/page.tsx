"use client";
import React, { useState, useMemo } from "react";
import { Category } from "@/types/category";
import CustomButton from "@/components/layouts/CustomBtn";
import { useCategoriesQuery } from "@/hooks/api/category.api";
import Loading from "@/components/common/Loading";
import {
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import CustomTable from "@/components/admin/CustomTable";
import { Column, Data } from "@/types/table";

const breadcrumbItems = [
  { label: "Home", path: "/admin/dashboard" },
  { label: "Category", path: "categories" },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  // No pagination
  const { data, isLoading, isError } = useCategoriesQuery();
  const categories: Category[] = data?.data ?? [];

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchLower) ||
          category.slug.toLowerCase().includes(searchLower) ||
          category.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by level - only show categories that have the selected level
    if (selectedLevel !== "all") {
      filtered = filtered.filter((category) => {
        const hasLevel = (
          cat: Category,
          targetLevel: number,
          currentLevel = 1
        ): boolean => {
          if (currentLevel === targetLevel) return true;
          if (cat.children && cat.children.length > 0) {
            return cat.children.some((child) =>
              hasLevel(child, targetLevel, currentLevel + 1)
            );
          }
          return false;
        };

        return hasLevel(category, selectedLevel);
      });
    }

    return filtered;
  }, [categories, searchTerm, selectedLevel]);

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Build visible rows based on expanded state
  const visibleRows: Data[] = useMemo(() => {
    const rows: Data[] = [];

    const traverse = (cats: Category[], level: number) => {
      cats.forEach((cat) => {
        rows.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description ?? "-",
          level,
          category: cat,
        });
        const isExpanded = expandedCategories.has(cat.id);
        if (isExpanded && cat.children && cat.children.length > 0) {
          traverse(cat.children, level + 1);
        }
      });
    };

    traverse(filteredCategories, 1);
    return rows;
  }, [filteredCategories, expandedCategories]);

  const totalPages = 1;

  const columns: readonly Column[] = [
    {
      id: "name",
      label: "Name",
      render: (row: Data) => {
        const cat = row.category as Category;
        const hasChildren = !!cat.children && cat.children.length > 0;
        const level = row.level as number;
        const isExpanded = expandedCategories.has(cat.id);
        const indent = { marginLeft: `${(level - 1) * 16}px` };
        return (
          <div style={indent} className="flex items-center">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(cat.id as number)}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium">{row.name as string}</span>
          </div>
        );
      },
    },
    {
      id: "slug",
      label: "Slug",
      render: (row: Data) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          {row.slug as string}
        </code>
      ),
    },
    {
      id: "description",
      label: "Description",
      render: (row: Data) => (
        <span className="text-sm text-gray-600">
          {(row.description as string) || "---"}
        </span>
      ),
    },
    {
      id: "level",
      label: "Level",
      render: (row: Data) => {
        const level = row.level as number;
        const classesByLevel: Record<number, string> = {
          1: "bg-blue-100 text-blue-800",
          2: "bg-green-100 text-green-800",
          3: "bg-purple-100 text-purple-800",
        };
        const levelBadgeClass =
          classesByLevel[level] ?? "bg-gray-100 text-gray-800";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${levelBadgeClass}`}
          >
            Level {level}
          </span>
        );
      },
    },
    // Actions column removed per request
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Category list" breadcrumbs={breadcrumbItems} />
      <div className="flex justify-end items-center mb-4">
        <CustomButton
          href="/admin/categories/create"
          variant="primary"
          size="small"
          className="flex items-center justify-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Category</span>
        </CustomButton>
      </div>
      <div className="bg-white rounded-lg shadow-lg">
        {isLoading && (
          <div className="p-6">
            <Loading />
          </div>
        )}
        {isError && (
          <div className="p-6 text-red-600">Failed to load categories.</div>
        )}

        {/* Table */}
        <div className="px-2 py-4">
          {!isLoading && visibleRows.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No categories found</p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first category"}
                </p>
              </div>
            </div>
          ) : (
            <CustomTable
              rows={visibleRows}
              columns={columns}
              rowsPerPage={visibleRows.length || 1}
              page={1}
              onPageChange={() => {}}
              totalPages={totalPages}
              height={500}
            />
          )}
        </div>
      </div>
    </div>
  );
}
