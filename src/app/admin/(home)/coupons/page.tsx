"use client";

import React from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/admin/common/ComponentCard";
import CustomButton from "@/components/layouts/CustomBtn";
import { CouponStatus, CouponType } from "@/types/coupon";
import { formatDate } from "@/utils/timeFormat";
import { Chip, Switch, IconButton, Tooltip } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import {
  useCouponsQuery,
  useUpdateCouponStatusMutation,
  useDeleteCouponMutation,
} from "@/hooks/api/coupon.api";
import useToastify from "@/hooks/useToastify";
import { formatCurrency } from "@/utils/formatCurrency";

const breadcrumbItems = [
  { label: "Home", path: "/admin/dashboard" },
  { label: "Coupons", path: "/admin/coupons" },
];

const AdminCouponsPage = () => {
  const { data, isLoading } = useCouponsQuery();
  const { mutate: updateStatus } = useUpdateCouponStatusMutation();
  const { mutate: deleteCoupon, isPending: isDeleting } =
    useDeleteCouponMutation();
  const { showSuccess, showError } = useToastify();
  const coupons = data?.data || [];

  const handleStatusToggle = (
    couponId: number,
    currentStatus: CouponStatus
  ) => {
    const newStatus =
      currentStatus === CouponStatus.ACTIVE
        ? CouponStatus.INACTIVE
        : CouponStatus.ACTIVE;

    updateStatus(
      { id: couponId, status: newStatus },
      {
        onSuccess: () => {
          showSuccess(`Coupon status updated to ${newStatus}`);
        },
        onError: () => {
          showError("Failed to update coupon status");
        },
      }
    );
  };

  const handleDeleteCoupon = (
    couponId: number,
    couponCode: string,
    usedCount: number
  ) => {
    if (usedCount > 0) {
      showError("Cannot delete coupon that has been used");
      return;
    }

    const isConfirmed = confirm(
      `Are you sure you want to delete coupon "${couponCode}"?`
    );
    if (!isConfirmed) return;

    deleteCoupon(couponId, {
      onSuccess: () => {
        showSuccess("Coupon deleted successfully");
      },
      onError: () => {
        showError("Failed to delete coupon");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Coupon list" breadcrumbs={breadcrumbItems} />
      <div className="flex justify-end">
        <Link href="/admin/coupons/create">
          <CustomButton size="small">Add coupon</CustomButton>
        </Link>
      </div>
      <ComponentCard title="Coupons List">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No coupons available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="border rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">Coupon Code</div>
                  <div className="flex items-center gap-2">
                    <Chip
                      label={String(c.status).toUpperCase()}
                      variant="outlined"
                      color={
                        c.status === CouponStatus.ACTIVE
                          ? "success"
                          : c.status === CouponStatus.EXPIRED
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                    <Switch
                      checked={c.status === CouponStatus.ACTIVE}
                      onChange={() => handleStatusToggle(c.id, c.status)}
                      disabled={c.usedCount > 0}
                      size="small"
                      color="primary"
                    />
                    <Tooltip
                      title={
                        c.usedCount > 0
                          ? "Cannot delete used coupon"
                          : "Delete coupon"
                      }
                      placement="top"
                    >
                      <span>
                        <IconButton
                          onClick={() =>
                            handleDeleteCoupon(c.id, c.code, c.usedCount)
                          }
                          disabled={c.usedCount > 0 || isDeleting}
                          size="small"
                          color="error"
                          className="hover:bg-red-50"
                        >
                          <FaTrash className="w-3 h-3" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </div>
                <div className="text-2xl font-extrabold tracking-wide text-primary">
                  {c.code}
                </div>
                {c.description && (
                  <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {c.description}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Type</div>
                    <div className="font-semibold">
                      {c.type === CouponType.PERCENTAGE
                        ? "Percentage"
                        : "Fixed Amount"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Value</div>
                    <div className="font-semibold">
                      {c.type === CouponType.PERCENTAGE
                        ? `${c.value}%`
                        : formatCurrency(c.value)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Usage Limit</div>
                    <div className="font-semibold">
                      {c.usedCount}/{c.usageLimit}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Min Order</div>
                    <div className="font-semibold">
                      {c.minOrderAmout
                        ? new Intl.NumberFormat("vi-VN").format(c.minOrderAmout)
                        : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Valid from {formatDate(c.startDate)} to{" "}
                  {formatDate(c.endDate)}
                </div>

                {c.usedCount > 0 && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    ⚠️ Cannot modify status - coupon has been used
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default AdminCouponsPage;
