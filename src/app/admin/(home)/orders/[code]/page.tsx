"use client";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/admin/common/ComponentCard";
import CustomTable from "@/components/admin/CustomTable";
import BasicSelectInput from "@/components/inputs/BasicSelectInput";
import CustomButton from "@/components/layouts/CustomBtn";
import { Column, Data } from "@/types/table";
import { useOrderQuery } from "@/hooks/api/order.api";
import { formatDate } from "@/utils/timeFormat";
import { formatCurrency } from "@/utils/formatCurrency";
import { Typography, Avatar } from "@mui/material";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { OrderStatus } from "@/types/orderStatus";
import Image from "next/image";
import { useUpdateOrderStatusMutation } from "@/hooks/api/order.api";
import OrderStatusTag, {
  getOrderStatusLabel,
} from "@/components/order/OrderStatusTag";
import OrderTimeline from "@/components/order/OrderTimeline";
import PaymentTypeTag from "@/components/order/PaymentTypeTag";
import useToastify from "@/hooks/useToastify";
import Loading from "@/components/common/Loading";
import NotFound from "@/app/not-found";

const OrderDetailPage = () => {
  const params = useParams();
  const { showInfo, showSuccess, showError } = useToastify();
  const orderCode = params.code as string;
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  const { data: orderData, isLoading } = useOrderQuery(orderCode);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatusMutation();
  const order = orderData?.data;

  // Create status options for BasicSelectInput
  const statusOptions = [
    { id: "", name: "All Status" },
    ...Object.values(OrderStatus).map((status) => ({
      id: status,
      name: getOrderStatusLabel(status),
    })),
  ];

  // Define columns for the products table
  const productColumns: Column[] = [
    {
      id: "product",
      label: "Product",
      minWidth: 250,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Image
            src={row.image || "/placeholder.png"}
            alt={row.productName}
            width={40}
            height={40}
            className="rounded object-cover"
          />
          <div>
            <Typography variant="body2" fontWeight="medium">
              {row.productName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.color} - {row.size}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      id: "sku",
      label: "SKU",
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2" fontFamily="monospace">
          {row.sku}
        </Typography>
      ),
    },
    {
      id: "price",
      label: "Price",
      minWidth: 100,
      render: (row) => formatCurrency(row.price),
    },
    {
      id: "quantity",
      label: "Quantity",
      minWidth: 100,
      render: (row) => row.quantity,
    },
    {
      id: "total",
      label: "Total",
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2" fontWeight="medium">
          {formatCurrency(row.total)}
        </Typography>
      ),
    },
  ];

  // Convert order items to table rows
  const productRows: Data[] = (order?.items || []).map((item) => ({
    id: item.id,
    productName: item.sku?.product?.name || "",
    image: item.sku?.product?.images?.[0] || "",
    color: item.sku?.color || "",
    size: item.sku?.size || "",
    sku: item.sku?.sku || "",
    price: item.price,
    quantity: item.quantity,
    total: item.total,
  }));

  const handleStatusUpdate = () => {
    if (!newStatus || newStatus === order?.status) {
      showInfo("Please select a different status");
      return;
    }

    updateStatus(
      { orderCode, newStatus },
      {
        onSuccess: () => {
          showSuccess("Order status updated successfully!");
          setNewStatus(OrderStatus.PENDING);
        },
        onError: (error) => {
          showError("Failed to update order status");
          console.error("Status update error:", error);
        },
      }
    );
  };

  useEffect(() => {
    setNewStatus(order?.status || OrderStatus.PENDING);
  }, [order]);

  if (isLoading) {
    return <Loading size="large" />;
  }

  if (!order) {
    return <NotFound />;
  }

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Orders", path: "/admin/orders" },
  ];

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle={`Order detail`}
        breadcrumbs={breadcrumbItems}
      />

      {/* Order Status Header */}
      <ComponentCard title="Order Information">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" component="h1" gutterBottom>
              Order #{order.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            {/* Status Update Form */}
            <div className="flex items-center gap-2">
              <OrderStatusTag orderStatus={order.status} />

              <BasicSelectInput
                value={newStatus}
                onChange={(value) => setNewStatus(value as OrderStatus)}
                options={statusOptions}
                size="small"
                placeHolder="Select Status"
              />
              <CustomButton
                onClick={handleStatusUpdate}
                disabled={
                  !newStatus || newStatus === order.status || isUpdating
                }
                size="small"
                className="min-w-[100px]"
              >
                {isUpdating ? "Updating..." : "Update"}
              </CustomButton>
            </div>
          </div>
        </div>
      </ComponentCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <ComponentCard title="Customer Information">
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              src={order.user?.avatar?.url}
              alt={`${order.user?.firstName} ${order.user?.lastName}`}
              sx={{ width: 48, height: 48 }}
            />
            <div>
              <Typography variant="subtitle1" fontWeight="medium">
                {order.user?.firstName} {order.user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.user?.phone}
              </Typography>
            </div>
          </div>
        </ComponentCard>

        {/* Shipping Information */}
        <ComponentCard title="Shipping Information">
          <div className="space-y-2">
            <Typography variant="body2">
              <strong>Delivery Address:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.address?.detail}, {order.address?.ward?.name},{" "}
              {order.address?.district?.name}, {order.address?.province?.name}
            </Typography>
            <Typography variant="body2">
              <strong>Shipping Fee:</strong> {formatCurrency(order.shippingFee)}
            </Typography>
            <Typography variant="body2">
              <strong>Tracking Number:</strong> N/A
            </Typography>
          </div>
        </ComponentCard>

        {/* Payment Information */}
        <ComponentCard title="Payment Information">
          <div className="space-y-2">
            <Typography variant="body2">
              <strong>Method:</strong>{" "}
              <PaymentTypeTag paymentMethod={order.paymentMethod} />
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong>{" "}
              <OrderStatusTag orderStatus={order.status} />
            </Typography>
            <Typography variant="body2">
              <strong>Total Amount:</strong> {formatCurrency(order.finalAmount)}
            </Typography>
            {order.coupon && (
              <Typography variant="body2">
                <strong>Coupon Applied:</strong> {order.coupon.code}
              </Typography>
            )}
          </div>
        </ComponentCard>

        {/* Order Summary */}
        <ComponentCard title="Order Summary">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">
                {formatCurrency(order.total)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body2">Discount:</Typography>
              <Typography variant="body2" color="error">
                -{formatCurrency(order.discount)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body2">Shipping:</Typography>
              <Typography variant="body2">
                {formatCurrency(order.shippingFee)}
              </Typography>
            </div>
            <hr />
            <div className="flex justify-between">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(order.finalAmount)}
              </Typography>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Products List */}
      <ComponentCard title="Products">
        <CustomTable
          columns={productColumns}
          rows={productRows}
          onPageChange={() => {}} // No pagination needed for order detail
          rowsPerPage={productRows.length}
          totalPages={1}
        />
      </ComponentCard>

      {/* Order Timeline */}
      <ComponentCard title="Order Timeline">
        <OrderTimeline
          orderCode={order.code}
          orderStatusHistory={order.orderStatusHistory}
          orderCreatedAt={order.createdAt}
        />
      </ComponentCard>
    </div>
  );
};

export default OrderDetailPage;
