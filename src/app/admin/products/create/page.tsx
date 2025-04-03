"use client";
import RadioInput from "@/components/inputs/RadioInput";
import RangeInput from "@/components/inputs/RangeInput";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useProductMutation } from "@/hooks/api/product.api";
import { Color } from "@/types/color";
import { Size } from "@/types/size";
import Image from "next/image";
import { useUploadImagesMutation } from "@/hooks/api/upload.api";
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
  description: "",
  price: 0,
  discountValue: null,
  discountType: DiscountType.NONE,
  isActive: true,
  categoryId: 3,
  skus: [],
  images: [],
};

const colorOptions = Object.values(Color).map((value) => ({
  name: value,
  id: value,
}));

const sizeOptions = Object.values(Size).map((value) => ({
  name: value,
  id: value,
}));

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

export default function ProductCreate() {
  const { showSuccess } = useToast();
  const { data } = useCategoriesQuery();
  const { mutateAsync } = useProductMutation();
  const { mutateAsync: uploadImages } = useUploadImagesMutation();
  const categoryData = useCategoryTreeData(data?.data);
  const [option, setOption] = useState<{
    color: Color;
    size: Size;
    quantity: number;
  }>({ color: Color.BLACK, size: Size.S, quantity: 0 });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const {
    control,
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues>({
    defaultValues,
    mode: "all",
    resolver: zodResolver(createProductSchema),
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "skus",
  });
  const isSKUDuplicate = fields.some(
    (sku) => sku.color === option.color && sku.size === option.size
  );

  const watchSkus = watch("skus");
  const handleAddSku = () => {
    if (isSKUDuplicate) return;
    append(option);
    setOption({ color: Color.BLACK, size: Size.S, quantity: 0 });
  };
  const images = watch("images");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const newPreviewImages = fileArray.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prev) => [...prev, ...newPreviewImages]);
      setValue("images", [...(watch("images") || []), ...fileArray], {
        shouldValidate: true,
      });
    }
  };

  const removeImage = (index: number) => {
    const isDelete = confirm("Bạn chắc chắn muốn xóa hình ảnh này?");
    if (isDelete) {
      const newFiles = Array.from(images || []).filter((_, i) => i !== index);
      setValue("images", newFiles, { shouldValidate: true });
      setPreviewImages(
        newFiles.map((file) => URL.createObjectURL(file as unknown as Blob))
      );
    }
  };

  const onSubmit: SubmitHandler<CreateProductFormValues> = async (data) => {
    try {
      let images: File[] = [];
      if (data.images) {
        const res = await uploadImages(data.images);
        images = res?.data;
      }
      const newProductData = { ...data, images };
      const { message, data: product } = await mutateAsync(newProductData);
      console.log(product.images);
      showSuccess(message);
      reset(defaultValues);
      setOption({ color: Color.BLACK, size: Size.S, quantity: 0 });
      setPreviewImages([]);
    } catch (error) {
      handleRequestError(error);
    }
  };
  const discountType = watch("discountType");
  useEffect(() => {
    if (discountType === DiscountType.NONE) setValue("discountValue", null);
    else setValue("discountValue", 0);
  }, [discountType, setValue]);
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
              <div
                className={`${
                  !!errors.description && "border border-[#d32f2f] rounded-sm"
                }`}
              >
                <ProductCkEditor
                  editorData={field.value}
                  setEditorData={(value) => setValue("description", value)}
                />
              </div>
            )}
          />
          {true && (
            <span className="text-[#d32f2f] text-xs">
              {errors.description?.message}
            </span>
          )}
        </ComponentCard>
        <ComponentCard title="Product details" className="h-fit">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <label className="flex w-fit items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-sm font-medium">
                  {watch("isActive") ? "Active" : "Inactive"}
                </span>
              </label>
            )}
          />
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
        <ComponentCard title="Media" className="col-span-2">
          <div
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`transition border-2 ${
              !!errors.images ? "border-[#d32f2f]" : "border-[#007aff]"
            }  border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500`}
          >
            <div
              className={`${
                !!errors.images ? "bg-[#fff8f8]" : "bg-[#e7f0fe]"
              } rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
                border-brand-500  dark:bg-gray-800`}
            >
              <input
                multiple
                {...register("images")}
                accept="image/"
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center m-0!">
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
          {!!errors.images && (
            <span className="text-[#d32f2f] text-xs">
              {errors.images?.message}
            </span>
          )}
          <div className="grid grid-cols-5 gap-2">
            {previewImages.map((image, index) => (
              <div
                key={index}
                className="relative h-fit w-fit rounded-lg border border-gray-300 p-2 flex flex-col items-center justify-between"
              >
                <Image
                  src={image}
                  alt="preview"
                  width={90}
                  height={90}
                  className="rounded-md object-cover w-32 h-32 overflow-hidden"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
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
                <Autocomplete
                  size="small"
                  options={colorOptions.filter((option) => {
                    const currentSize = fields[index].size;
                    const usedColors = fields
                      .filter(
                        (sku, i) => sku.size === currentSize && i !== index
                      )
                      .map((sku) => sku.color);
                    return !usedColors.includes(option.id);
                  })}
                  getOptionLabel={(option) => option.name}
                  value={
                    colorOptions.find(
                      (item) => item.name === watch(`skus.${index}.color`)
                    ) || null
                  }
                  onChange={(_, newValue) => {
                    update(index, {
                      ...watchSkus[index],
                      color: newValue?.id || Color.BLACK,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.skus?.[index]?.size}
                      helperText={errors.skus?.[index]?.size?.message}
                    />
                  )}
                />
              </div>
              <div className="col-span-3">
                <Autocomplete
                  size="small"
                  options={sizeOptions.filter((option) => {
                    const currentColor = fields[index].color;
                    const usedSizes = fields
                      .filter(
                        (sku, i) => sku.color === currentColor && i !== index
                      )
                      .map((sku) => sku.size);
                    return !usedSizes.includes(option.id);
                  })}
                  getOptionLabel={(option) => option.name}
                  value={
                    sizeOptions.find(
                      (item) => item.name === watch(`skus.${index}.size`)
                    ) || null
                  }
                  onChange={(_, newValue) => {
                    update(index, {
                      ...watchSkus[index],
                      size: newValue?.id || Size.S,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.skus?.[index]?.size}
                      helperText={errors.skus?.[index]?.size?.message}
                    />
                  )}
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
                setOption({ ...option, color: newValue?.id || Color.BLACK })
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
                setOption({ ...option, size: newValue?.id || Size.S })
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
                if (+value < 0) return;
                setOption({ ...option, quantity: +value });
              }}
              value={option.quantity}
              type="number"
              size="small"
            />
            <button
              disabled={isSKUDuplicate}
              onClick={(e) => {
                e.preventDefault();
                handleAddSku();
              }}
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
      <CustomButton
        disabled={isSubmitting}
        className="mt-6 text-white rounded-2xl"
      >
        Create
      </CustomButton>
    </form>
  );
}
