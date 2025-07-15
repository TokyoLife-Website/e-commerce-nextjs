import React from "react";
import { Rating } from "@mui/material";

interface RatingSummaryProps {
  average: number;
  totalReviews: number;
  breakdown: { [star: number]: number };
}

export const RatingSummary = ({
  average,
  totalReviews,
  breakdown,
}: RatingSummaryProps) => {
  const maxCount = Math.max(...Object.values(breakdown), 1);

  return (
    <div className="flex w-1/2 gap-6 bg-[#fafafa] rounded-lg py-4 px-6 shadow-sm">
      <div className="text-center w-1/3 border-r border-[#eeeeee]">
        <p className="text-5xl font-medium mb-2">
          {average}
          <span className="text-[28px]">/5</span>
        </p>
        <Rating precision={0.5} size="medium" readOnly value={average} />
        <p className="text-sm mt-3 leading-[1.5]">{totalReviews} đánh giá</p>
      </div>

      <div className="flex flex-col  w-2/3 justify-center">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown[star] || 0;
          const percent = (count / maxCount) * 100;
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm w-2">{star}</span>
                <Rating size="small" max={1} readOnly value={1} />
              </div>
              <div className="h-2 w-60 bg-gray-200 rounded">
                <div
                  className="h-2 bg-[#faaf00] rounded"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="text-sm w-5 text-center">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
