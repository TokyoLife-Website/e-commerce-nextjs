"use client";
import React, { useState } from "react";
import { PiPencilSimpleLineThin } from "react-icons/pi";
import { MdOutlineDelete } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { closeModal, openModal } from "@/redux/modalSlice";
import { IoCloseOutline } from "react-icons/io5";
import { Address } from "@/types/address";
import CustomButton from "../CustomBtn";
import { ModalType } from "@/types/modal";
import { useDeleteUserAddressMutation } from "@/hooks/api/address.api";
import useToast from "@/hooks/useToastify";
import { handleRequestError } from "@/utils/errorHandler";

const SelectAddressModal = () => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useToast();
  const { data: modalData } = useAppSelector((state) => state.modal);
  const { addresses, selectedAddress, onSelectAddress } = modalData as {
    addresses: Address[];
    selectedAddress: Address;
    onSelectAddress: (address: Address) => void;
  };
  const { mutateAsync: deleteAddress } = useDeleteUserAddressMutation();
  const [clickedAddress, setclickedAddress] =
    useState<Address>(selectedAddress);

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const { message } = await deleteAddress(addressId);
      const updatedAddresses = addresses.filter(
        (addr) => +addr.id !== addressId
      );
      dispatch(
        openModal({
          type: ModalType.SELECT_ADDRESS,
          data: {
            addresses: updatedAddresses,
            selectedAddress: selectedAddress,
            onSelectAddress,
          },
        })
      );
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };
  return (
    <div className="overflow-y-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-6 bg-white shadow-md max-w-4xl">
      <div className="font-extrabold text-xl leading-6 mb-6 flex justify-between items-center">
        CHỌN ĐỊA CHỈ GIAO HÀNG
        <IoCloseOutline
          onClick={() => dispatch(closeModal())}
          className="w-8 h-8 cursor-pointer"
        />
      </div>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => {
              setclickedAddress(address);
            }}
            className={`${
              address.id === clickedAddress.id
                ? "border-l-4 border-double border-primary bg-[#f1f5f9]"
                : "bg-[#f8fafc] pl-4"
            }  flex items-center gap-2 flex-wrap rounded-r p-3 space-y-1 relative`}
          >
            <p>
              <span className="font-semibold">Họ và tên:</span>{" "}
              {address.fullName}
            </p>
            <p>
              <span className="font-semibold">SĐT:</span> {address.phone}
            </p>
            <p>
              <span className="font-semibold">Địa chỉ giao hàng:</span>{" "}
              {address.detail}, {address.ward.name}, {address.district.name},{" "}
              {address.province.name}
            </p>
            <p className="w-full flex justify-end gap-3 leading-[18px] text-[#525252]">
              <button
                onClick={() => {
                  dispatch(
                    openModal({ type: ModalType.ADDRESS, data: address })
                  );
                }}
                className="flex gap-2"
              >
                <PiPencilSimpleLineThin /> Chỉnh sửa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(), handleDeleteAddress(+address.id);
                }}
                className="flex gap-2"
              >
                <MdOutlineDelete />
                Xóa
              </button>
            </p>
            {address.isDefault && (
              <span className="absolute hidden sm:block top-2 right-2 text-sm text-primary">
                Địa chỉ mặc định
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-center mt-4">
        <CustomButton
          className="hover:bg-primary hover:text-white ease-in duration-150 text-black border w-1/2 font-normal bg-transparent"
          size="small"
          onClick={() => {
            dispatch(openModal({ type: ModalType.ADDRESS }));
          }}
        >
          Thêm địa chỉ mới
        </CustomButton>
        <CustomButton
          className="text-white w-1/2 font-normal border border-primary"
          size="small"
          onClick={() => {
            onSelectAddress(clickedAddress);
            dispatch(closeModal());
          }}
        >
          Chọn địa chỉ
        </CustomButton>
      </div>
    </div>
  );
};

export default SelectAddressModal;
