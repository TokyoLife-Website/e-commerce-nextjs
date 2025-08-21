"use client";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import CustomTable from "@/components/admin/CustomTable";
import { useProductsQuery } from "@/hooks/api/product.api";
import { Column } from "@/types/table";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/timeFormat";
import { Chip, Rating } from "@mui/material";
import { LuEye } from "react-icons/lu";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
const breadcrumbItems = [
  { label: "Home", path: "/" },
  { label: "Product", path: "products" },
];
const PAGE_SIZE = 5;
const columns: Column[] = [
  {
    id: "name",
    label: "Name",
    minWidth: 150,
    render: (row) => (
      <div className="flex items-center justify-start gap-3">
        <Image
          className="w-16 h-16 object-cover rounded"
          alt="primary image"
          src={row.images[0] || ""}
          width={90}
          height={90}
        />
        <div className="flex flex-col gap-2 items-start justify-start">
          <span className="font-medium text-sm">{row.name}</span>
          <span className="font-normal text-sm text-[#919eab]">
            {row.category?.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "stock",
    label: "Stock",
    render: (row) => row.stock,
    minWidth: 100,
  },
  {
    id: "price",
    label: "Price",
    render: (row) => formatCurrency(row.price),
    minWidth: 100,
  },
  {
    id: "rating",
    label: "Rating",
    render: (row) => (
      <Rating name="half-rating" size="small" readOnly value={row.rating} />
    ),
    minWidth: 100,
  },
  {
    id: "isActive",
    label: "Status",
    minWidth: 100,
    render: (row) => (
      <Chip
        label={row.isActive ? "Active" : "Inactive"}
        variant="outlined"
        color={row.isActive ? "success" : "error"}
      />
    ),
  },
  {
    id: "createdAt",
    label: "Published on",
    render: (row) => formatDate(row.createdAt),
    minWidth: 100,
  },
  {
    id: "action",
    label: "",
    render: (row) => (
      <Link href={`/admin/products/${row.id}`}>
        <LuEye className="w-5 h-5" />
      </Link>
    ),
    minWidth: 50,
  },
];
const ProductList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data } = useProductsQuery({ page: currentPage, size: PAGE_SIZE });
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
  const { items, totalPages } = data?.data || {};
  return (
    <div>
      <PageBreadcrumb pageTitle="Product list" breadcrumbs={breadcrumbItems} />

      <CustomTable
        columns={columns}
        rows={items || []}
        onPageChange={handleChangePage}
        rowsPerPage={PAGE_SIZE}
        totalPages={totalPages || 0}
      />
    </div>
  );
};

export default ProductList;
