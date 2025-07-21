import React from "react";
import PaymentFailedIcon from "../icons/PaymentFailedIcon";

interface NoSearchResultProps {
  keyword: string;
}

const NoSearchResult: React.FC<NoSearchResultProps> = ({ keyword }) => {
  return (
    <div className="flex flex-col items-center w-full px-6 pt-10 text-center">
      <PaymentFailedIcon />
      <p className="text-center text-gray-700 text-lg mt-8 mb-12">
        Không tìm thấy sản phẩm với từ khóa <strong>{keyword}</strong>
      </p>
    </div>
  );
};

export default NoSearchResult;
