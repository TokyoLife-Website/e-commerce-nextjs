"use client";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import CustomTable from "@/components/admin/CustomTable";
import BasicSelectInput from "@/components/inputs/BasicSelectInput";
import { Column, Data } from "@/types/table";
import { useAdminOrdersQuery } from "@/hooks/api/order.api";
import { formatDate } from "@/utils/timeFormat";
import { formatCurrency } from "@/utils/formatCurrency";
import { Chip, Avatar } from "@mui/material";
import React, { useState } from "react";
import { OrderStatus } from "@/types/orderStatus";
import Image from "next/image";
import Link from "next/link";
import OrderStatusTag from "@/components/order/OrderStatusTag";

const breadcrumbItems = [
  { label: "Home", path: "/" },
  { label: "Orders", path: "/admin/orders" },
];

const PAGE_SIZE = 10;

const OrdersListPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const { data } = useAdminOrdersQuery(
    currentPage,
    PAGE_SIZE,
    statusFilter || undefined
  );

  const handleChangePage = (page: number) => setCurrentPage(page);
  const handleStatusFilterChange = (value: string | number) => {
    setStatusFilter(value as OrderStatus | "");
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Create status options for BasicSelectInput
  const statusOptions = [
    { id: "", name: "All Status" },
    ...Object.values(OrderStatus).map((status) => ({
      id: status,
      name: status,
    })),
  ];

  const { items, totalPages } = data?.data || {};

  const rows: Data[] = (items || []).map((order) => ({
    id: order.id,
    code: order.code,
    customerName: `${order.user?.firstName} ${order.user?.lastName}`,
    customerEmail: order.user?.email,
    customerAvatar: order.user?.avatar?.url,
    status: order.status,
    total: order.total,
    finalAmount: order.finalAmount,
    itemsCount: order.items?.length || 0,
    createdAt: order.createdAt,
    paymentMethod: order.paymentMethod,
  })) as Data[];

  const columns: Column[] = [
    {
      id: "code",
      label: "Order Code",
      minWidth: 120,
      render: (row) => (
        <Link href={`/admin/orders/${encodeURIComponent(row.code)}`}>
          <span className="font-mono text-sm font-medium text-blue-600 hover:underline">
            {row.code}
          </span>
        </Link>
      ),
    },
    {
      id: "customerName",
      label: "Customer",
      minWidth: 180,
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Avatar
            alt={row.customerName}
            src={row.customerAvatar || "/assets/images/default-avatar.png"}
            sx={{ width: 32, height: 32 }}
          />
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm">{row.customerName}</span>
            <span className="text-xs text-gray-500">{row.customerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 120,
      render: (row) => <OrderStatusTag orderStatus={row.status} />,
    },
    {
      id: "itemsCount",
      label: "Items",
      minWidth: 80,
      render: (row) => (
        <span className="text-sm font-medium">{row.itemsCount}</span>
      ),
    },
    {
      id: "total",
      label: "Total",
      minWidth: 120,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm line-through text-gray-500">
            {formatCurrency(row.total)}
          </span>
          <span className="font-medium text-green-600">
            {formatCurrency(row.finalAmount)}
          </span>
        </div>
      ),
    },
    {
      id: "paymentMethod",
      label: "Payment",
      minWidth: 100,
      render: (row) => (
        <span className="text-sm font-medium capitalize">
          {row.paymentMethod?.toLowerCase()}
        </span>
      ),
    },
    {
      id: "createdAt",
      label: "Order Date",
      minWidth: 140,
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Orders list" breadcrumbs={breadcrumbItems} />

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div style={{ minWidth: 200 }}>
          <BasicSelectInput
            label="Status Filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={statusOptions}
            size="small"
            placeHolder="All Status"
          />
        </div>
      </div>

      <CustomTable
        columns={columns}
        rows={rows}
        page={currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={PAGE_SIZE}
        totalPages={totalPages || 0}
      />
    </div>
  );
};

export default OrdersListPage;
