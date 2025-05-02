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
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
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
      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            page === currentPage
              ? "bg-primary text-white"
              : "border border-gray-300 hover:bg-gray-100"
          }`}
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
