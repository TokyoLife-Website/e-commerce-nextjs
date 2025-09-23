"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/components/layouts/CustomBtn";
import { Category } from "@/types/category";
import {
  createCategorySchema,
  CreateCategoryFormData,
} from "@/schemas/createCategorySchema";
import TextInput from "@/components/inputs/TextInput";
import BasicSelectInput from "@/components/inputs/BasicSelectInput";
import RadioInput from "@/components/inputs/RadioInput";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/admin/common/ComponentCard";
import {
  useCreateCategoryMutation,
  useCategoriesQuery,
} from "@/hooks/api/category.api";
import useToast from "@/hooks/useToastify";
import { handleRequestError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { createSlug } from "@/utils/createSlug";

const breadcrumbItems = [
  { label: "Home", path: "/admin/dashboard" },
  { label: "Category", path: "/admin/categories" },
];

export default function CreateCategoryPage() {
  const router = useRouter();
  const { showSuccess } = useToast();
  const { data: categoriesData } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();

  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedSubParent, setSelectedSubParent] = useState<Category | null>(
    null
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      level: 1,
      parentId: null,
    },
  });

  const watchedLevel = watch("level");
  const watchedName = watch("name");

  // Generate slug from name

  // Auto-generate slug when name changes
  useEffect(() => {
    if (watchedName) {
      setValue("slug", createSlug(watchedName));
    }
  }, [watchedName, setValue]);

  // Reset all form values when level changes (but not on initial load)
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Reset form fields
    setValue("name", "");
    setValue("slug", "");
    setValue("description", "");
    setValue("parentId", null);

    // Reset state
    setSelectedParent(null);
    setSelectedSubParent(null);
  }, [watchedLevel, setValue, isInitialLoad]);

  const handleParentChange = (parentId: string | number) => {
    const parent = getAvailableParents().find((p) => p.id === parentId);
    if (parent) {
      setSelectedParent(parent);
      setSelectedSubParent(null);
      setValue("parentId", parent.id);
    }
  };

  const handleSubParentChange = (subParentId: string | number) => {
    const subParent = getAvailableSubParents().find(
      (p) => p.id === subParentId
    );
    if (subParent) {
      setSelectedSubParent(subParent);
      setValue("parentId", subParent.id);
    }
  };

  const onSubmit = async (data: CreateCategoryFormData) => {
    try {
      const categoryData = {
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        parentId: data.parentId || undefined,
      };

      const result = await createCategoryMutation.mutateAsync(categoryData);
      showSuccess("Category created successfully!");
      router.push("/admin/categories");
    } catch (error) {
      handleRequestError(error);
    }
  };

  const getAvailableParents = () => {
    const allCategories = categoriesData?.data || [];
    const parentCategories = allCategories.filter(
      (category) => !category.parent
    );
    return parentCategories;
  };

  const getAvailableSubParents = () => {
    if (Number(watchedLevel) === 3 && selectedParent) {
      return selectedParent.children || [];
    }
    return [];
  };

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Create new category"
        breadcrumbs={breadcrumbItems}
      />
      <ComponentCard title="" className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Level */}
          <RadioInput
            name="level"
            control={control}
            label="Category Level"
            isError={!!errors.level}
            errMsg={errors.level?.message}
            isRequired
            options={[
              { id: 1, name: "Level 1 (Main Category)" },
              { id: 2, name: "Level 2 (Sub Category)" },
              { id: 3, name: "Level 3 (Sub-sub Category)" },
            ]}
          />

          {/* Select Parent Category (Level 2 and 3) */}
          {watchedLevel && Number(watchedLevel) > 1 && (
            <BasicSelectInput
              label="Parent Category (Level 1)"
              value={selectedParent?.id || ""}
              onChange={handleParentChange}
              options={getAvailableParents().map((parent) => ({
                id: parent.id,
                name: parent.name,
              }))}
              placeHolder="Select parent category"
              isRequired
            />
          )}

          {/* Select Level 2 Parent Category (Level 3 only) */}
          {watchedLevel && Number(watchedLevel) === 3 && (
            <BasicSelectInput
              label="Parent Category (Level 2)"
              value={selectedSubParent?.id || ""}
              onChange={handleSubParentChange}
              options={getAvailableSubParents().map((subParent) => ({
                id: subParent.id,
                name: subParent.name,
              }))}
              placeHolder="Select Level 2 parent category"
              isRequired
            />
          )}

          {/* Category Name */}
          <TextInput
            name="name"
            control={control}
            label="Category Name"
            isError={!!errors.name}
            errMsg={errors.name?.message}
            isRequired
            placeHolder="Enter category name"
          />

          {/* Slug */}
          <TextInput
            name="slug"
            control={control}
            label="Slug"
            isError={!!errors.slug}
            errMsg={errors.slug?.message}
            isRequired
            placeHolder="category-slug"
          />
          <p className="text-xs text-gray-500 -mt-2">
            Slug will be auto-generated from category name
          </p>

          {/* Description */}
          <TextInput
            name="description"
            control={control}
            label="Description"
            isError={!!errors.description}
            errMsg={errors.description?.message}
            type="textarea"
            placeHolder="Enter category description"
          />

          {/* Category Structure Preview */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Category Structure:
            </h3>
            <div className="text-sm text-gray-600">
              {Number(watchedLevel) === 1 && (
                <div>📁 {watchedName || "Category Name"}</div>
              )}
              {Number(watchedLevel) === 2 && selectedParent && (
                <div>
                  <div>📁 {selectedParent.name}</div>
                  <div className="ml-4">
                    └── 📁 {watchedName || "Category Name"}
                  </div>
                </div>
              )}
              {Number(watchedLevel) === 3 &&
                selectedParent &&
                selectedSubParent && (
                  <div>
                    <div>📁 {selectedParent.name}</div>
                    <div className="ml-4">└── 📁 {selectedSubParent.name}</div>
                    <div className="ml-8">
                      └── 📁 {watchedName || "Category Name"}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending
                ? "Creating..."
                : "Create Category"}
            </CustomButton>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
