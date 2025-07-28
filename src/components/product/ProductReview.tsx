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
    <div className="flex flex-col lg:flex-row w-full lg:w-1/2 gap-4 lg:gap-6 bg-[#fafafa] rounded-lg py-4 px-4 lg:px-6 shadow-sm">
      <div className="text-center w-full lg:w-1/3 lg:border-r lg:border-[#eeeeee] lg:pr-6 pb-4 lg:pb-0">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-2">
          {average}
          <span className="text-lg sm:text-xl lg:text-[28px]">/5</span>
        </p>
        <Rating
          precision={0.5}
          size="medium"
          readOnly
          value={average}
          className="scale-90 sm:scale-100"
        />
        <p className="text-xs sm:text-sm mt-2 lg:mt-3 leading-[1.5]">
          {totalReviews} đánh giá
        </p>
      </div>

      <div className="flex flex-col w-full lg:w-2/3 justify-center">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown[star] || 0;
          const percent = (count / maxCount) * 100;
          return (
            <div
              key={star}
              className="flex items-center gap-2 sm:gap-3 mb-1 lg:mb-0"
            >
              <div className="flex items-center gap-1 min-w-[40px] sm:min-w-[50px]">
                <span className="text-xs sm:text-sm w-2">{star}</span>
                <Rating
                  size="small"
                  max={1}
                  readOnly
                  value={1}
                  className="scale-75 sm:scale-90 lg:scale-100"
                />
              </div>
              <div className="h-2 w-32 sm:w-40 lg:w-60 bg-gray-200 rounded flex-1">
                <div
                  className="h-2 bg-[#faaf00] rounded"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm w-4 sm:w-5 text-center">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
