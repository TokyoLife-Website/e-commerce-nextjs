"use client";
import React, { useState } from "react";
import { Avatar, Rating } from "@mui/material";
import CommentItem from "./CommentItem";

const CommentList = () => {
  const [filter, setFilter] = useState<number | null>(null);
  return (
    <div>
      <div className="flex items-center gap-4 py-4 border-y border-[#eeeeee]">
        <span className="font-semibold text-sm leading-[18px]">
          Lọc đánh giá
        </span>
        <div className="flex gap-3 flex-wrap items-center">
          <button
            className={`border hover:bg-primary/5 px-4 py-2 rounded ${
              filter === null
                ? "border-primary text-primary bg-white"
                : "bg-[#f5f5f5]"
            }`}
            onClick={() => setFilter(null)}
          >
            Tất cả
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              className={`border px-4 py-2 rounded hover:bg-primary/5 ${
                filter === star
                  ? "border-primary text-primary bg-white"
                  : "bg-[#f5f5f5]"
              }`}
              onClick={() => setFilter(star)}
            >
              {star} sao
            </button>
          ))}
        </div>
      </div>
      <CommentItem
        avatarAlt="Tien"
        color="Red"
        rating={5}
        comment="Hàng tốt lắm"
        date="10/03/2025"
        size="SIZE M"
        userName="LÊ MINH TIẾN"
      />
    </div>
  );
};

export default CommentList;
