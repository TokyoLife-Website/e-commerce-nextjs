import React, { FC } from "react";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa6";

interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ReviewPagination: FC<ReviewPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPages = () => {
    const pages = [];
    const maxVisiblePages = 5; // Số trang tối đa hiển thị

    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang ít, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu tiên
      pages.push(1);

      // Tính toán các trang xung quanh trang hiện tại
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Thêm dấu ... nếu cần
      if (startPage > 2) {
        pages.push("...");
      }

      // Thêm các trang ở giữa
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Thêm dấu ... nếu cần
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Luôn hiển thị trang cuối cùng
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-end space-x-2 mt-6">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={`w-8 h-8 flex items-center justify-center rounded ${
          currentPage === 1 ? "text-gray-400" : "hover:bg-gray-200"
        } `}
        disabled={currentPage === 1}
      >
        <FaCaretLeft />
      </button>
      {getPages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            page === currentPage
              ? "bg-primary text-white"
              : page === "..."
              ? "border-none"
              : "border border-gray-300 hover:bg-gray-100"
          }`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className={`w-8 h-8 flex items-center justify-center rounded ${
          currentPage === totalPages ? "text-gray-400" : "hover:bg-gray-200"
        } `}
        disabled={currentPage === totalPages}
      >
        <FaCaretRight />
      </button>
    </div>
  );
};

export default ReviewPagination;
