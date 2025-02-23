"use client";
import {
  useDeleteUserAddressMutation,
  useUpdateUserAddressMutation,
  useUserAddressesQuery,
} from "@/hooks/api/address.api";
import useToast from "@/hooks/useToastify";
import { AddressType } from "@/types/address";
import { handleRequestError } from "@/utils/errorHandler";

export default function Address() {
  const { showSuccess } = useToast();
  const { data } = useUserAddressesQuery();
  const { mutateAsync: deleteAddress } = useDeleteUserAddressMutation();
  const { mutateAsync: updateAddress } = useUpdateUserAddressMutation();

  const handleUpdateAddress = async (addressId: number) => {
    try {
      const { message } = await updateAddress({
        addressId,
        updateAddressDto: { isDefault: true },
      });
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const { message } = await deleteAddress(addressId);
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <form className="flex flex-col gap-y-5">
      <div className="uppercase font-extrabold leading-6 text-xl mb-6 pb-6 border-b">
        ĐỊA CHỈ GIAO HÀNG
      </div>
      {data?.data.map((address) => (
        <div
          key={address.id}
          className="py-6 flex justify-between border-b border-[#e9e9e9]"
        >
          <div className="flex flex-col gap-[11px]">
            <div className="flex items-center gap-[22px]">
              <p className="font-extrabold leading-[18px]">{`${address.user.firstName} ${address.user.lastName}`}</p>
              {address.isDefault && (
                <div className="font-semibold px-1.5 py-1 text-xs text-[#555555] bg-secondary rounded">
                  Mặc định
                </div>
              )}
              <div
                className={`font-semibold px-2 py-1 text-xs rounded text-white ${
                  address.type === AddressType.HOME
                    ? "bg-green-500"
                    : address.type === AddressType.OFFICE
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              >
                {address.type === AddressType.HOME
                  ? "🏠 Nhà riêng"
                  : address.type === AddressType.OFFICE
                  ? "🏢 Văn phòng"
                  : "📦 Khác"}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm leading-[18px] text-[#555555]">
                Địa chỉ:{" "}
                <span className="text-black">
                  {`${address.detail}, ${address.ward.name}, ${address.district.name}, ${address.province.name}`}
                </span>
              </p>
              <p className="font-medium text-sm leading-[18px] text-[#555555]">
                Điện thoại:{" "}
                <span className="text-black">{address.user.phone}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 text-sm font-semibold">
            <div className="flex gap-[30px]">
              {!address.isDefault && (
                <p
                  onClick={() => handleUpdateAddress(+address.id)}
                  className="cursor-pointer"
                >
                  Đặt mặc định
                </p>
              )}
              <p className="cursor-pointer">Chỉnh sửa</p>
            </div>
            <p
              onClick={() => handleDeleteAddress(+address.id)}
              className="text-primary cursor-pointer"
            >
              Xóa
            </p>
          </div>
        </div>
      ))}

      <button className="hover:bg-primary hover:text-white ease-in duration-150 px-8 py-2.5 font-semibold text-xs leading-4 w-full border border-dashed border-[#999999]">
        THÊM ĐỊA CHỈ MỚI
      </button>
    </form>
  );
}
