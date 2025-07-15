import React, { FC } from "react";
import CustomButton from "../layouts/CustomBtn";
import { formatDate } from "@/utils/formatDate";
import dayjs from "dayjs";
import { Rating } from "@mui/material";
import { ReviewItem } from "@/types/review";
import Link from "next/link";

interface ReviewedListProps {
  reviewedListData: ReviewItem[];
}

const ReviewedList: FC<ReviewedListProps> = ({ reviewedListData }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full rounded-lg text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4 w-1/6 font-semibold">Hình ảnh</th>
            <th className="p-4 w-1/6 font-semibold">Tên sản phẩm</th>
            <th className="p-4 w-1/6 font-semibold">Phiên bản</th>
            <th className="p-4 w-1/6 font-semibold">Ngày đánh giá</th>
            <th className="p-4 w-2/6 font-semibold">Đánh giá</th>
          </tr>
        </thead>
        <tbody>
          {reviewedListData &&
            reviewedListData.map((reviewItem) => (
              <tr key={reviewItem.orderItemId}>
                <td className="p-4">
                  <img
                    src={reviewItem?.productImage || ""}
                    alt={reviewItem.productName}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded"
                  />
                </td>
                <td className="p-4">
                  <Link className="text-lg" href={`/${reviewItem.productSlug}`}>
                    {reviewItem.productName}
                  </Link>
                </td>
                <td className="p-4 text-primary font-semibold">
                  Size {reviewItem.size} - {reviewItem.color}
                </td>
                <td className="p-4">
                  {formatDate(
                    reviewItem?.reviewDate || dayjs().toDate(),
                    "DD/MM/YYYY"
                  )}
                </td>
                <td className="p-4 ">
                  <div className="flex flex-col justify-center">
                    <Rating
                      precision={0.5}
                      name="half-rating"
                      size="small"
                      readOnly
                      value={reviewItem.rating}
                    />
                    <span className="line-clamp-3">{reviewItem.comment}</span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewedList;
