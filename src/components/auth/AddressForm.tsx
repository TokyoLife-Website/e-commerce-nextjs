import React from "react";
import CustomButton from "../CustomBtn";
import TextInput from "../TextInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRequestError } from "@/utils/errorHandler";
import useToast from "@/hooks/useToastify";
import { useAppDispatch } from "@/redux/store";
import { closeModal } from "@/redux/modalSlice";
import { IoCloseOutline } from "react-icons/io5";
import { Address, AddressType } from "@/types/address";
import { AddressFormData, addressSchema } from "@/schemas/addressSchema";
import useAddress from "@/hooks/useAddress";
import CheckboxInput from "../CheckboxInput";
import { useCreateUserAddressMutation } from "@/hooks/api/address.api";
import AutoCompleteInput from "../AutoCompleteInput";
import { useAppSelector } from "@/redux/store";

export const AddressForm = () => {
  const { showSuccess } = useToast();
  const { mutateAsync } = useCreateUserAddressMutation();
  const dispatch = useAppDispatch();

  const currentAddressData = useAppSelector(
    (state) => state.modal.data
  ) as Address;

  const defaultValues = {
    fullName: currentAddressData?.fullName || "",
    email: currentAddressData?.email || "",
    phone: currentAddressData?.phone || "",
    provinceId: +currentAddressData?.province.id || 0,
    districtId: +currentAddressData?.district.id || 0,
    wardId: +currentAddressData?.ward.id || 0,
    detail: currentAddressData?.detail || "",
    isDefault: currentAddressData?.isDefault || true,
    type: currentAddressData?.type || AddressType.HOME,
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(addressSchema),
  });

  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    try {
      const { message } = await mutateAsync(data);
      showSuccess(message);
      dispatch(closeModal());
    } catch (error) {
      handleRequestError(error);
    }
  };
  const selectedProvince = watch("provinceId");
  const selectedDistrict = watch("districtId");

  watch((value, { name }) => {
    if (name === "provinceId") {
      setValue("districtId", 0);
      setValue("wardId", 0);
    }
    if (name === "districtId") {
      setValue("wardId", 0);
    }
  });

  const { provinces, districts, wards } = useAddress(
    selectedProvince,
    selectedDistrict
  );
  return (
    <div className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-y-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-6 bg-white shadow-md max-w-4xl"
      >
        <div className="font-extrabold text-xl leading-6  mb-6 flex justify-between ỉtems-center">
          ĐỊA CHỈ GIAO HÀNG
          <IoCloseOutline
            onClick={() => dispatch(closeModal())}
            className="w-8 h-8"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <TextInput
            name="fullName"
            control={control}
            errMsg={errors.fullName?.message}
            isError={!!errors.fullName}
            label="Họ tên"
            isRequired
            size="small"
            placeHolder="Nhập họ tên của bạn"
          />
          <TextInput
            name="phone"
            control={control}
            errMsg={errors.phone?.message}
            isError={!!errors.phone}
            label="SĐT"
            isRequired
            size="small"
            placeHolder="Nhập số điện thoại"
          />
          <div className="col-span-1">
            <TextInput
              name="email"
              control={control}
              errMsg={errors.email?.message}
              isError={!!errors.email}
              label="Email"
              isRequired
              size="small"
              placeHolder="Nhập Email"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <AutoCompleteInput
            defaultValue={2}
            size="small"
            name="provinceId"
            label="Tỉnh/Thành phố"
            control={control}
            isError={!!errors.provinceId}
            errMsg={errors.provinceId?.message}
            options={provinces.map((province) => ({
              id: province.id,
              name: province.name,
            }))}
          />
          <AutoCompleteInput
            name="districtId"
            label="Quận/Huyện"
            isRequired
            control={control}
            isError={!!errors.districtId}
            errMsg={errors.districtId?.message}
            options={districts.map((district) => ({
              id: district.id,
              name: district.name,
            }))}
            size="small"
            disabled={!selectedProvince}
          />
          <AutoCompleteInput
            name="wardId"
            label="Xã/Phường"
            placeHolder="Xã/Phường"
            isRequired
            control={control}
            isError={!!errors.wardId}
            errMsg={errors.wardId?.message}
            options={wards.map((ward) => ({
              id: ward.id,
              name: ward.name,
            }))}
            size="small"
            disabled={!selectedDistrict}
          />
          <div className="md:col-span-2">
            <TextInput
              name="detail"
              control={control}
              errMsg={errors.detail?.message}
              isError={!!errors.detail}
              label="Địa chỉ"
              isRequired
              size="small"
              placeHolder="Nhập địa chỉ của bạn"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <CheckboxInput
            isChecked={currentAddressData?.isDefault}
            id="defaultAddress"
            name="isDefault"
            control={control}
            isError={!!errors.isDefault}
          />
          <label
            htmlFor="defaultAddress"
            className="text-sm font-normal text-[#222222] leading-[18px]"
          >
            Đặt làm địa chỉ mặc định
          </label>
        </div>
        <CustomButton size="small" className=" text-white">
          Lưu thông tin
        </CustomButton>
      </form>
    </div>
  );
};
