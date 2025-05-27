import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { useAppDispatch } from "@/redux/store";
import { openModal } from "@/redux/modalSlice";
import { ModalType } from "@/types/modal";
import { Address } from "@/types/address";
import { useUserAddressesQuery } from "@/hooks/api/address.api";
import { PaymentMethod } from "@/types/paymentMethod";

export default function CheckoutInfo() {
  const { data: addresses, isLoading } = useUserAddressesQuery();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    PaymentMethod.COD
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addresses?.data && addresses.data.length > 0) {
      const defaultAddress = addresses.data.find(
        (address) => address.isDefault
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else {
        setSelectedAddress(addresses.data[0]);
      }
    }
  }, [addresses]);

  const handleOpenAddressModal = () => {
    dispatch(openModal({ type: ModalType.ADDRESS }));
  };

  const handleOpenSelectAddressModal = () => {
    dispatch(
      openModal({
        type: ModalType.SELECT_ADDRESS,
        data: {
          addresses: addresses?.data as Address[],
          selectedAddress,
          onSelectAddress: (address: Address) => {
            setSelectedAddress(address);
          },
        },
      })
    );
  };

  return (
    <div className="space-y-6 bg-white rounded-sm p-4 lg:p-6 h-fit">
      {/* ĐỊA CHỈ GIAO HÀNG */}
      <div className="rounded-lg p-4 space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-500" /> ĐỊA CHỈ GIAO HÀNG
        </h2>
        {selectedAddress && (
          <div className="border-l-4 border-double border-primary bg-[#f5f5f5] flex items-center gap-2 flex-wrap rounded-r p-3 space-y-1 relative">
            <p>
              <span className="font-semibold">Họ và tên:</span>{" "}
              {selectedAddress.fullName}
            </p>
            <p>
              <span className="font-semibold">SĐT:</span>{" "}
              {selectedAddress.phone}
            </p>
            <p>
              <span className="font-semibold">Địa chỉ giao hàng:</span>{" "}
              {selectedAddress.detail}, {selectedAddress.ward.name},{" "}
              {selectedAddress.district.name}, {selectedAddress.province.name}
            </p>
            {selectedAddress.isDefault && (
              <span className="absolute hidden sm:block top-2 right-2 text-sm text-primary">
                Địa chỉ mặc định
              </span>
            )}
          </div>
        )}

        <div className="text-sm flex flex-wrap float-end">
          <button
            className="underline mr-2"
            type="button"
            onClick={handleOpenAddressModal}
          >
            Thêm địa chỉ giao hàng
          </button>
          <span className="sm:block hidden mr-2">-</span>
          <button
            className="underline"
            type="button"
            onClick={handleOpenSelectAddressModal}
          >
            Chọn địa chỉ giao hàng
          </button>
        </div>
      </div>

      {/* PHƯƠNG THỨC THANH TOÁN */}
      <div className="rounded-lg p-4 space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <FaMoneyBillWave className="text-green-600" /> PHƯƠNG THỨC THANH TOÁN
        </h2>
        <div className="space-y-2 ">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value={PaymentMethod.COD}
              checked={selectedPayment === PaymentMethod.COD}
              onChange={() => setSelectedPayment(PaymentMethod.COD)}
            />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </label>

          <label className="flex  items-center gap-2">
            <input
              type="radio"
              name="payment"
              value={PaymentMethod.VN_PAY}
              checked={selectedPayment === PaymentMethod.VN_PAY}
              onChange={() => setSelectedPayment(PaymentMethod.VN_PAY)}
            />
            <span>
              Thẻ ATM/Visa/Master/JCB/QR Pay qua{" "}
              <span className="font-semibold">VNPAY-QR</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
