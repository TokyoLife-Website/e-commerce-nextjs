"use client";
import AutoCompleteInput from "@/components/inputs/AutoCompleteInput";
import RadioInput from "@/components/inputs/RadioInput";
import RangeInput from "@/components/inputs/RangeInput";
import SelectInput from "@/components/inputs/SelectInput";
import TextInput from "@/components/inputs/TextInput";
import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import CustomButton from "@/components/layouts/CustomBtn";
import useToast from "@/hooks/useToastify";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { TreeSelect } from "antd";
import {
  CreateProductFormValues,
  createProductSchema,
} from "@/schemas/createProductSchema";
import { DiscountType } from "@/types/discountType";
import { handleRequestError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useMemo, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import dynamic from "next/dynamic";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { useCategoriesQuery } from "@/hooks/api/category.api";
import { Category } from "@/types/category";
import CustomLabel from "@/components/layouts/CustomLabel";
const ProductCkEditor = dynamic(
  () => import("@/components/admin/ProductEditor"),
  {
    loading: () => <p>Loading ckeditor...</p>,
    ssr: false,
  }
);

const defaultValues: CreateProductFormValues = {
  name: "",
  slug: "",
  description: "abc",
  price: 0,
  discountValue: 0,
  discountType: DiscountType.NONE,
  isActive: true,
  categoryId: 9,
  skus: [],
};

const colorOptions = [
  { id: 0, name: "Đỏ" },
  { id: 1, name: "Xanh" },
  { id: 2, name: "Vàng" },
];

const sizeOptions = [
  { id: 0, name: "S" },
  { id: 1, name: "M" },
  { id: 2, name: "L" },
];

const breadcrumbItems = [
  { label: "Home", path: "/" },
  { label: "Product", path: "products" },
];

const useCategoryTreeData = (categories?: Category[]) => {
  const mapCategoriesToTreeData = useCallback(
    (categories: Category[], level = 1): any[] => {
      return categories.map((category) => ({
        title: category.name,
        value: category.id,
        disabled: level < 3,
        children: category.children?.length
          ? mapCategoriesToTreeData(category.children, level + 1)
          : [],
      }));
    },
    []
  );

  return useMemo(
    () => mapCategoriesToTreeData(categories || []),
    [categories, mapCategoriesToTreeData]
  );
};

export default function Product() {
  const { showSuccess } = useToast();
  const { data } = useCategoriesQuery();
  const categoryData = useCategoryTreeData(data?.data);
  const [option, setOption] = useState<{
    color: number;
    size: number;
    quantity: number;
  }>({ color: 0, size: 0, quantity: 0 });
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(createProductSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skus",
  });

  const handleAddSku = () => {
    append(option);
    setOption({ color: 0, size: 0, quantity: 0 });
  };

  const onSubmit: SubmitHandler<CreateProductFormValues> = async (data) => {
    try {
      showSuccess("ok");
      console.log(data);
    } catch (error) {
      handleRequestError(error);
    }
  };
  const discountType = watch("discountType");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageBreadcrumb
        pageTitle="Create new product"
        breadcrumbs={breadcrumbItems}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ComponentCard title="General" className="col-span-2">
          <TextInput
            isRequired
            label="Product name"
            name="name"
            control={control}
            errMsg={errors.name?.message}
            isError={!!errors.name}
            placeHolder="Nhập tên sản phẩm"
          />
          <Controller
            name={"description"}
            control={control}
            render={({ field }) => (
              <ProductCkEditor
                editorData={field.value}
                setEditorData={(value) => setValue("description", value)}
              />
            )}
          />
        </ComponentCard>
        <ComponentCard title="Status" className="h-fit">
          <SelectInput
            name="isActive"
            control={control}
            isError={!!errors.isActive}
            errMsg={errors.isActive?.message}
            isRequired
            label="Status"
            options={[
              { id: 0, name: "true" },
              { id: 1, name: "false" },
            ]}
          />
        </ComponentCard>
        <ComponentCard title="Media" className="col-span-2">
          <div
            onClick={() => document.getElementById("fileInput")?.click()}
            className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500"
          >
            <div
              className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
                border-brand-500 bg-gray-100 dark:bg-gray-800`}
            >
              <input type="file" id="fileInput" className="hidden" />
              <div className="dz-message flex flex-col items-center m-0!">
                <div className="mb-[22px] flex justify-center">
                  <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <svg
                      className="fill-current"
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                      />
                    </svg>
                  </div>
                </div>
                <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                  Drop Files Here
                </h4>
                <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                  Drag and drop your PNG, JPG, WebP, SVG images here or browse
                </span>
                <span className="font-medium underline text-theme-sm text-brand-500">
                  Browse File
                </span>
              </div>
            </div>
          </div>
        </ComponentCard>
        <ComponentCard title="Product details" className="h-fit">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Stack spacing={0.5}>
                <CustomLabel label="Category" isRequired={true} />
                <TreeSelect
                  {...field}
                  className="w-full h-14 rounded-full"
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Please select"
                  treeDefaultExpandAll
                  treeData={categoryData}
                  size="large"
                />
              </Stack>
            )}
          />
          <TextInput
            label="Slug"
            name="slug"
            control={control}
            errMsg={errors.slug?.message}
            isError={!!errors.slug}
            placeHolder="Nhập slug cuả sản phẩm"
          />
        </ComponentCard>
        <ComponentCard title="SKU" className="col-span-2">
          <div className="grid grid-cols-10 gap-6">
            <span className="font-medium text-sm col-span-3">Color</span>
            <span className="font-medium text-sm col-span-3">Size</span>
            <span className="font-medium text-sm col-span-3">Quantity</span>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-10 gap-6">
              <div className="col-span-3">
                <AutoCompleteInput
                  size="small"
                  name={`skus.${index}.color`}
                  control={control}
                  isError={!!errors.skus?.[index]?.color}
                  errMsg={errors.skus?.[index]?.color?.message}
                  defaultValue={0}
                  options={colorOptions}
                />
              </div>
              <div className="col-span-3">
                <AutoCompleteInput
                  size="small"
                  name={`skus.${index}.size`}
                  control={control}
                  isError={!!errors.skus?.[index]?.size}
                  errMsg={errors.skus?.[index]?.size?.message}
                  options={sizeOptions}
                />
              </div>
              <div className="col-span-3">
                <TextInput
                  isRequired
                  size="small"
                  type="number"
                  name={`skus.${index}.quantity`}
                  control={control}
                  isError={!!errors.skus?.[index]?.quantity}
                  errMsg={errors.skus?.[index]?.quantity?.message}
                  placeHolder="Nhập số lượng"
                  defaultValue={field.quantity}
                />
              </div>
              <button
                onClick={() => remove(index)}
                disabled={!field.id}
                className="flex flex-shrink-0 items-center justify-center cursor-pointer w-10 h-10 rounded-md border-[0.25px] border-[#000000de] bg-white dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <FaMinus />
              </button>
            </div>
          ))}
          <div className="grid grid-cols-10 gap-6">
            <Autocomplete
              className="col-span-3"
              onChange={(_, newValue) =>
                setOption({ ...option, color: newValue?.id || 0 })
              }
              value={
                colorOptions.find((item) => item.id === option.color) || null
              }
              options={colorOptions}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              size={"small"}
              renderInput={(params) => <TextField {...params} />}
            />
            <Autocomplete
              className="col-span-3"
              onChange={(_, newValue) =>
                setOption({ ...option, size: newValue?.id || 0 })
              }
              value={
                sizeOptions.find((item) => item.id === option.size) || null
              }
              options={sizeOptions}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              size={"small"}
              renderInput={(params) => <TextField {...params} />}
            />
            <TextField
              className="col-span-3"
              onChange={(e) => {
                const value = (e.target as HTMLInputElement).value;
                setOption({ ...option, quantity: +value });
              }}
              value={option.quantity}
              type="number"
              size="small"
            />
            <button
              onClick={handleAddSku}
              className="flex flex-shrink-0 items-center justify-center cursor-pointer w-10 h-10 rounded-md border-[0.25px] border-[#000000de] bg-white dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <FaPlus />
            </button>
          </div>
        </ComponentCard>
        <ComponentCard title="Pricing" className="col-span-2">
          <TextInput
            label="Base price"
            isRequired
            name="price"
            type="number"
            control={control}
            errMsg={errors.price?.message}
            isError={!!errors.price}
            placeHolder="Nhập giá cuả sản phẩm"
          />
          <RadioInput
            name="discountType"
            control={control}
            label="Discount type"
            isError={!!errors.discountType}
            errMsg={errors.discountType?.message}
            options={[
              { id: DiscountType.NONE, name: "No Discount" },
              { id: DiscountType.PERCENTAGE, name: "Percentage %" },
              { id: DiscountType.FIXED, name: "Fixed Price" },
            ]}
            isRequired
          />
          {discountType === DiscountType.PERCENTAGE && (
            <RangeInput
              name="discountValue"
              control={control}
              label="Set Discount Percentage"
              isRequired
              min={0}
              max={100}
              step={5}
              isError={!!errors.discountValue}
              errMsg={errors.discountValue?.message}
            />
          )}
          {discountType === DiscountType.FIXED && (
            <TextInput
              isRequired
              label="Fixed Discounted Price"
              name="discountValue"
              type="number"
              control={control}
              errMsg={errors.discountValue?.message}
              isError={!!errors.discountValue}
              placeHolder="Discount Price"
            />
          )}
        </ComponentCard>
      </div>
      <CustomButton className="mt-6 text-white rounded-2xl">
        Create
      </CustomButton>
    </form>
  );
}
