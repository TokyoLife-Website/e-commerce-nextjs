import React from "react";
import { PolicyItem, PolicyItemType } from "./PolicyItem";
import FreeShippingIcon from "../../../public/free_shipping.svg";
import ReturnIcon from "../../../public/return.svg";
import MoneyBagIcon from "../../../public/money_bag.svg";

const policyDeliveryList: PolicyItemType[] = [
  {
    icon: <FreeShippingIcon />,
    text: "Miễn phí giao hàng cho đơn từ 295.000đ",
  },
  {
    icon: <ReturnIcon />,
    text: "Lỗi 1 đổi 1 trong vòng 15 ngày (*)",
  },
  {
    icon: <MoneyBagIcon />,
    text: "Được kiểm tra khi nhận hàng",
  },
];
const PolicyList = () => {
  return (
    <div className="py-4 flex gap-1">
      {policyDeliveryList.map((item, index) => (
        <PolicyItem key={index} icon={item.icon} text={item.text} />
      ))}
    </div>
  );
};

export default PolicyList;
