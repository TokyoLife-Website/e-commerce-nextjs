import React from 'react';

export default function CartPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Giỏ hàng</h1>
      {/* Cart content will go here */}
      <div className="space-y-4">
        <p className="text-gray-500">Chưa có sản phẩm trong giỏ hàng</p>
      </div>
    </div>
  );
} 