"use client";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import CustomTable from "@/components/admin/CustomTable";
import { Column, Data } from "@/types/table";
import {
  useUpdateUserStatusMutation,
  useUsersQuery,
} from "@/hooks/api/user.api";
import { formatDate } from "@/utils/timeFormat";
import { Avatar, Chip, Switch } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

const breadcrumbItems = [
  { label: "Home", path: "/admin/dashboard" },
  { label: "Customers", path: "/admin/customers" },
];

const PAGE_SIZE = 1;

const columns = (
  updateStatus: (args: { id: number; isActive: boolean }) => void
): Column[] => [
  {
    id: "name",
    label: "Name",
    minWidth: 200,
    render: (row) => (
      <div className="flex items-center justify-start gap-3">
        {row.avatarUrl ? (
          <Image
            className="w-10 h-10 object-cover rounded-full"
            alt="avatar"
            src={row.avatarUrl}
            width={40}
            height={40}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40 }} />
        )}
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">
            {row.firstName} {row.lastName}
          </span>
          <span className="text-xs text-[#919eab]">{row.email}</span>
        </div>
      </div>
    ),
  },
  { id: "phone", label: "Phone", minWidth: 140 },
  {
    id: "gender",
    label: "Gender",
    minWidth: 100,
    render: (row) =>
      row.gender === "M" ? "Male" : row.gender === "F" ? "Female" : "Other",
  },
  {
    id: "role",
    label: "Role",
    minWidth: 100,
    render: (row) => (
      <Chip
        label={String(row.role).toUpperCase()}
        variant="outlined"
        color={
          String(row.role).toLowerCase() === "admin" ? "primary" : "default"
        }
      />
    ),
  },
  {
    id: "createdAt",
    label: "Joined",
    minWidth: 160,
    render: (row) => formatDate(row.createdAt),
  },
  {
    id: "isActive",
    label: "Status",
    minWidth: 120,
    render: (row) => (
      <div className="flex items-center gap-2">
        <Switch
          checked={Boolean(row.isActive)}
          onChange={(e) =>
            updateStatus({ id: Number(row.id), isActive: e.target.checked })
          }
          color={row.isActive ? "success" : "default"}
        />
        <span
          className={`text-sm font-medium ${
            row.isActive ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
];

const CustomersListPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data } = useUsersQuery({ page: currentPage, size: PAGE_SIZE });
  const { mutate: updateStatus } = useUpdateUserStatusMutation();

  const handleChangePage = (page: number) => setCurrentPage(page);

  const { items, totalPages } = data?.data || {};
  const rows: Data[] = (items || []).map((u) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    gender: u.gender,
    role: u.role,
    createdAt: u.createdAt,
    avatarUrl: u.avatar?.url,
    isActive: u.isActive,
  })) as Data[];

  return (
    <div>
      <PageBreadcrumb pageTitle="Customer list" breadcrumbs={breadcrumbItems} />
      <CustomTable
        columns={columns(updateStatus)}
        rows={rows}
        page={currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={PAGE_SIZE}
        totalPages={totalPages || 0}
      />
    </div>
  );
};

export default CustomersListPage;
