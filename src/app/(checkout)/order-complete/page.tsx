import React from 'react';
import Link from 'next/link';

export default function OrderCompletePage() {
  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Đặt hàng thành công!
      </h1>
      <p className="text-gray-600 mb-8">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ gửi email xác nhận đơn hàng của bạn trong thời gian sớm nhất.
      </p>
      <div className="space-x-4">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/orders"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Xem đơn hàng
        </Link>
      </div>
    </div>
  );
} 