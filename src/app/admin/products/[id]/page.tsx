"use client";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import { useParams } from "next/navigation";
import React from "react";
const breadcrumbItems = [
  { label: "Home", path: "/" },
  { label: "Product", path: "products" },
];
const EditProductPage = () => {
  const { id } = useParams();
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Products detail"
        breadcrumbs={breadcrumbItems}
      />
      Detail {id}
    </div>
  );
};

export default EditProductPage;
