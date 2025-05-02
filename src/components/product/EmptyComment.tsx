import Image from "next/image";
import React, { FC } from "react";

interface EmptyCommentProps {
  content: string;
}

const EmptyComment: FC<EmptyCommentProps> = ({ content }) => {
  return (
    <div className="w-full flex flex-col items-center gap-6 py-10 px-20 bg-[#fafafa]">
      <Image
        alt="empty_image"
        src={"./empty_review.svg"}
        width={314}
        height={215}
      />
      <p className="text-[14px] font-normal">{content}</p>
    </div>
  );
};

export default EmptyComment;
