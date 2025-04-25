import { Avatar, Rating } from "@mui/material";

type CommentItemProps = {
  avatarAlt: string;
  userName: string;
  rating: number;
  color: string;
  size: string;
  comment: string;
  date: string;
};

export default function CommentItem({
  avatarAlt,
  userName,
  rating,
  color,
  size,
  comment,
  date,
}: CommentItemProps) {
  return (
    <div className="flex gap-4 border-b pt-[24px] w-full overflow-hidden">
      <div className="flex-shrink-0">
        <Avatar alt={avatarAlt} />
      </div>
      <div className="flex-1">
        <h6 className="font-semibold text-base">{userName}</h6>
        <Rating precision={0.5} size="small" readOnly value={rating} />
        <div className="text-[#737373] text-sm leading-[18px] mt-3">
          Màu sắc: {color}, Kích thước: {size}
        </div>
        <div className="my-4 text-sm">{comment}</div>
        <div className="text-[#999999] text-sm my-6">
          Đã đánh giá ngày: {date}
        </div>
      </div>
    </div>
  );
}
