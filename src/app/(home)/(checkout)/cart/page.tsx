"use client";
import CustomButton from "@/components/layouts/CustomBtn";
import { formatCurrency } from "@/utils/formatCurrency";
import { FaTrash } from "react-icons/fa";
import React from "react";

export const fakeCartItems = [
  {
    id: "1",
    name: "Áo Polo Unibody Premium",
    image:
      "https://cdn.shopify.com/s/files/1/0565/6931/1365/products/aopolo.jpg?v=1672043550",
    price: 299000,
    originalPrice: 599000,
    size: "S",
    color: "Ghi",
    quantity: 1,
  },
  {
    id: "2",
    name: "NAM/ Giày chạy êm chân",
    image:
      "https://cdn.shopify.com/s/files/1/0565/6931/1365/products/giayxanh.jpg?v=1672043551",
    price: 699000,
    originalPrice: 999000,
    size: "41",
    color: "Xanh",
    quantity: 1,
  },
  {
    id: "3",
    name: "NAM/ Giày chạy êm chân",
    image:
      "https://cdn.shopify.com/s/files/1/0565/6931/1365/products/giayghi.jpg?v=1672043552",
    price: 699000,
    originalPrice: 999000,
    size: "41",
    color: "Ghi",
    quantity: 1,
  },
];

export default function CartPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] pb-20">
        {/* Cart Items List - 2/3 width on large screens, full width on small screens */}
        <div className="lg:col-span-2 bg-white rounded-sm p-4 lg:p-6 h-fit">
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-gray-900 mb-6 uppercase">
            Giỏ hàng
            <p className="text-primary font-normal text-xs leading-[1.5] lowercase">
              (1 sản phẩm)
            </p>
          </h1>
          <div className="space-y-4 overflow-x-auto">
            <table className="w-full table-auto min-w-[600px]">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-2">Tên Hàng</th>
                  <th className="py-2">Giá</th>
                  <th className="py-2">Số Lượng</th>
                  <th className="py-2">Tổng Tiền</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {fakeCartItems.map((item) => (
                  <tr key={item.id} className="border-b py-4 text-sm align-top">
                    <td className="py-4 flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded"
                      />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <select className="mt-1 px-2 py-1 border rounded text-sm">
                          <option>Chọn phân loại</option>
                        </select>
                        <div className="mt-1 text-sm text-gray-600">
                          Kích thước:{" "}
                          <span className="font-semibold">
                            Size {item.size}
                          </span>
                          <br />
                          Màu sắc:{" "}
                          <span className="font-semibold">{item.color}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-red-600 font-semibold">
                      {item.price.toLocaleString("vi-VN")}đ
                      <div className="text-gray-400 line-through text-sm">
                        {item.originalPrice.toLocaleString("vi-VN")}đ
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center border rounded w-fit overflow-hidden">
                        <button className="px-2 text-lg">−</button>
                        <span className="px-3">{item.quantity}</span>
                        <button className="px-2 text-lg">+</button>
                      </div>
                    </td>
                    <td className="py-4 font-bold flex flex-col items-end">
                      {(item.quantity * item.price).toLocaleString("vi-VN")} đ
                      <button className="text-gray-500 hover:text-red-600 transition pt-4 lg:pt-16">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary - 1/3 width on large screens, full width on small screens */}
        <div className="lg:col-span-1 bg-white h-fit rounded-sm p-4 lg:p-6">
          <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>

          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Tổng giá trị đơn hàng</span>
            <span className="text-primary text-xl font-bold">
              {formatCurrency(549000)}
            </span>
          </div>

          <hr className="border-dashed border-2 my-4" />

          <CustomButton size="small" className="text-white w-full font-normal">
            TIẾP TỤC THANH TOÁN ➔
          </CustomButton>
          <p className="text-sm text-gray-600 mt-3">
            Dùng mã giảm giá của{" "}
            <span className="text-red-600 font-semibold">TokyoLife</span> trong
            bước tiếp theo
          </p>
        </div>
      </div>
    </div>
  );
}
