"use client";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import CustomTable from "@/components/admin/CustomTable";
import { useAllReviewsForAdminQuery } from "@/hooks/api/review.api";
import { useUpdateReviewStatusMutation } from "@/hooks/api/review.api";
import { Column } from "@/types/table";
import { formatDate } from "@/utils/timeFormat";
import { Rating } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { Switch } from "@mui/material";

const breadcrumbItems = [{ label: "Home", path: "/admin/dashboard" }];

const PAGE_SIZE = 10;

const AdminReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState({
    rating: "",
    isActive: "",
  });

  const { data, isLoading } = useAllReviewsForAdminQuery(
    filters.rating || undefined,
    filters.isActive !== "" ? filters.isActive === "true" : undefined,
    currentPage,
    PAGE_SIZE
  );

  const updateReviewStatusMutation = useUpdateReviewStatusMutation();

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({ rating: "", isActive: "" });
    setCurrentPage(1);
  };

  const handleToggleStatus = (reviewId: number, newStatus: boolean) => {
    updateReviewStatusMutation.mutate({ reviewId, isActive: newStatus });
  };

  const columns: Column[] = [
    {
      id: "user",
      label: "Customer",
      minWidth: 200,
      render: (row) => (
        <div className="flex items-center justify-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {row.user?.avatar ? (
              <Image
                className="w-10 h-10 rounded-full object-cover"
                alt="avatar"
                src={row.user.avatar.url || ""}
                width={40}
                height={40}
              />
            ) : (
              <span className="text-gray-500 text-sm font-medium">
                {row.user?.firstName?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 items-start justify-start">
            <span className="font-medium text-sm">
              {row.user?.firstName} {row.user?.lastName}
            </span>
            <span className="font-normal text-xs text-[#919eab]">
              {row.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "product",
      label: "Product",
      minWidth: 250,
      render: (row) => (
        <div className="flex items-center justify-start gap-3">
          <Image
            className="w-16 h-16 object-cover rounded"
            alt="product image"
            src={row.sku?.product?.images?.[0] || "/placeholder-product.jpg"}
            width={64}
            height={64}
          />
          <div className="flex flex-col gap-2 items-start justify-start">
            <span className="font-medium text-sm">
              {row.sku?.product?.name}
            </span>
            <span className="font-normal text-xs text-[#919eab]">
              Size: {row.sku?.size} | Color: {row.sku?.color}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "rating",
      label: "Rating",
      minWidth: 120,
      render: (row) => (
        <div className="flex flex-col items-center gap-1">
          <Rating name="read-only" size="small" readOnly value={row.rating} />
          <span className="text-xs text-gray-600">{row.rating}/5</span>
        </div>
      ),
    },
    {
      id: "comment",
      label: "Comment",
      minWidth: 200,
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="text-sm text-gray-900 line-clamp-2">{row.comment}</p>
        </div>
      ),
    },
    {
      id: "createdAt",
      label: "Review Date",
      render: (row) => formatDate(row.createdAt),
      minWidth: 120,
    },
    {
      id: "action",
      label: "Status",
      render: (row) => (
        <div className="flex items-center">
          <Switch
            checked={row.isActive}
            onChange={() => handleToggleStatus(row.id, !row.isActive)}
            color="primary"
            size="small"
          />
          <span className="ml-2 text-sm text-gray-600">
            {row.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      minWidth: 120,
    },
  ];

  const { items, totalPages } = data?.data || {};

  return (
    <div>
      <PageBreadcrumb pageTitle="Review list" breadcrumbs={breadcrumbItems} />

      {/* Filters */}
      <Box className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={filters.rating}
              label="Rating"
              onChange={(e) => handleFilterChange("rating", e.target.value)}
            >
              <MenuItem value="">All Ratings</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.isActive}
              label="Status"
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={clearFilters} size="small">
            Clear Filters
          </Button>
        </Stack>
      </Box>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <CustomTable
          columns={columns}
          rows={(items || []) as any[]}
          onPageChange={handleChangePage}
          rowsPerPage={PAGE_SIZE}
          totalPages={totalPages || 0}
        />
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
