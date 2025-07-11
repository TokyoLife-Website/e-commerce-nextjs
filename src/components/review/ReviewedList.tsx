import React from "react";
import CustomButton from "../layouts/CustomBtn";
import { formatDate } from "@/utils/formatDate";
import dayjs from "dayjs";
import { Rating } from "@mui/material";

const ReviewedList = () => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full rounded-lg text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4 w-1/6 font-semibold">Hình ảnh</th>
            <th className="p-4 w-1/6 font-semibold">Tên sản phẩm</th>
            <th className="p-4 w-1/6 font-semibold">Phiên bản</th>
            <th className="p-4 w-1/6 font-semibold">Ngày mua</th>
            <th className="p-4 w-2/6 font-semibold">Đánh giá</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4">Áo Thun Nam</td>
            <td className="p-4">Áo Thun Nam</td>
            <td className="p-4 text-primary font-semibold">Size L - Màu Đen</td>
            <td className="p-4">
              {formatDate(dayjs().toDate(), "DD/MM/YYYY")}
            </td>
            <td className="p-4 flex flex-col">
              <Rating name="half-rating" size="small" readOnly value={1} />
              <span>
                Hàng không như mô tả, chất lượng kém, đề nghị hoàn tiền nếu
                không sẽ đốt quán
              </span>
            </td>
          </tr>
          <tr>
            <td className="p-4">Áo Thun Nam</td>
            <td className="p-4">Áo Thun Nam</td>
            <td className="p-4 text-primary font-semibold">Size L - Màu Đen</td>
            <td className="p-4">
              {formatDate(dayjs().toDate(), "DD/MM/YYYY")}
            </td>
            <td className="p-4 flex flex-col">
              <Rating name="half-rating" size="small" readOnly value={1} />
              <span>Hàng như shit, đây là lần cuối tôi mua</span>
            </td>
          </tr>
          <tr>
            <td className="p-4">Áo Thun Nam</td>
            <td className="p-4">Áo Thun Nam</td>
            <td className="p-4 text-primary font-semibold">Size L - Màu Đen</td>
            <td className="p-4">
              {formatDate(dayjs().toDate(), "DD/MM/YYYY")}
            </td>
            <td className="p-4 flex flex-col">
              <Rating name="half-rating" size="small" readOnly value={5} />
              <span>Hàng tốt đấy hẹ hẹ hẹ</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReviewedList;
