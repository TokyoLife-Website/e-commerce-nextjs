import { useUpdateOrderStatusMutation } from "@/hooks/api/order.api";
import { closeModal } from "@/redux/modalSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { OrderStatus } from "@/types/orderStatus";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import CustomButton from "../CustomBtn";
import useToast from "@/hooks/useToastify";
import { handleRequestError } from "@/utils/errorHandler";

export const ConfirmCancelOrderForm = () => {
  const currentOrderCode = useAppSelector(
    (state) => state.modal.data
  ) as string;
  const dispatch = useAppDispatch();
  const { showSuccess } = useToast();
  const { mutateAsync: cancelOrder } = useUpdateOrderStatusMutation();
  const handleCancelOrder = async (orderCode: string) => {
    try {
      const { message } = await cancelOrder({
        orderCode,
        newStatus: OrderStatus.CANCELLED,
      });
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    } finally {
      dispatch(closeModal());
    }
  };
  return (
    <div className="overflow-y-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white shadow-md w-fit">
      <div className="font-extrabold text-xl leading-6  mb-6 flex justify-between items-center">
        Huỷ đơn hàng
        <IoCloseOutline
          onClick={() => dispatch(closeModal())}
          className="w-8 h-8"
        />
      </div>
      <div className="text-lg mb-6">
        Xác nhận hủy đơn hàng. Bạn sẽ không thể hoàn tác sau khi hủy đơn
      </div>
      <div className="flex justify-end gap-4">
        <CustomButton
          variant="outline"
          size="small"
          className="border-gray-200 px-3 py-2 text-black hover:bg-primary hover:text-white"
          onClick={() => dispatch(closeModal())}
        >
          Hủy
        </CustomButton>
        <CustomButton
          type="button"
          size="small"
          className=" text-white"
          onClick={() => handleCancelOrder(currentOrderCode)}
        >
          Xác nhận
        </CustomButton>
      </div>
    </div>
  );
};
