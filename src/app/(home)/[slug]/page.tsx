"use client";
import { useProductBySlugQuery } from "@/hooks/api/product.api";
import { useParams } from "next/navigation";
import React, { useEffect, useCallback } from "react";

import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import { Rating } from "@mui/material";
import { useAppDispatch } from "@/redux/store";
import { openModal } from "@/redux/modalSlice";
import { ModalType } from "@/types/modal";
import Link from "next/link";
import PolicyList from "@/components/product/PolicyList";
import { RatingSummary } from "@/components/product/ProductReview";
import CommentList from "@/components/product/CommentList";
import NotFound from "@/app/not-found";
import { formatCurrency } from "@/utils/formatCurrency";
import DOMPurify from "dompurify";
import { SKU } from "@/types/sku";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import { useForm, Controller, Control } from "react-hook-form";
import { Product } from "@/types/product";
import Loading from "@/components/common/Loading";
import { useLoading } from "@/hooks/useLoading";
import { useAddToCartMutation } from "@/hooks/api/cart.api";
import useToast from "@/hooks/useToastify";
import { handleRequestError } from "@/utils/errorHandler";
import { useDebounce } from "@/hooks/useDebounce";
import { Icon } from "@/components/icons";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";

interface AddToCartForm {
  color: string;
  size: string;
  quantity: number;
}

interface ProductDetailProps {
  product: Product;
}

// Product Color Selector Component
const ProductColorSelector: React.FC<{
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}> = ({ colors, selectedColor, onColorChange }) => (
  <div className="grid gap-3">
    <div className="flex font-semibold text-sm leading-[18px] text-black gap-2">
      <p>MÀU SẮC</p>
      <p className="font-normal">|</p>
      <p className="font-normal">{selectedColor}</p>
    </div>
    <div className="flex gap-2">
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => onColorChange(color)}
          className={`cursor-pointer w-9 h-9 aspect-square rounded-full border border-black ${
            selectedColor === color ? "outline-2 outline-offset-2 outline" : ""
          }`}
          style={{ background: color }}
        ></div>
      ))}
    </div>
  </div>
);

// Product Size Selector Component
const ProductSizeSelector: React.FC<{
  skus: SKU[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}> = ({ skus, selectedSize, onSizeChange }) => (
  <div className="grid gap-3">
    <div className="flex font-semibold text-sm leading-[18px] text-black gap-2">
      KÍCH THƯỚC
    </div>
    <div className="flex flex-wrap gap-2">
      {skus.map((sku: SKU) => {
        const isDisabled = sku.quantity === 0;
        const isSelected = selectedSize === sku.size;
        const baseClass =
          "transition duration-200 select-none text-sm leading-[100%] px-4 py-[6px] flex items-center justify-center rounded-[50px] shadow-[0_0_0_1px_rgb(153,153,153)]";
        const className = isDisabled
          ? "bg-[#f5f5f5] text-[#00000042] cursor-not-allowed"
          : isSelected
          ? "bg-black text-white cursor-pointer"
          : "bg-white text-black border-black cursor-pointer";
        return (
          <span
            key={sku.size}
            onClick={() => {
              if (!isDisabled) onSizeChange(sku.size);
            }}
            className={`${baseClass} ${className}`}
          >
            SIZE {sku.size}
          </span>
        );
      })}
    </div>
  </div>
);

// Quantity Selector Component
const QuantitySelector: React.FC<{
  control: Control<AddToCartForm>;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: number) => void
  ) => void;
}> = ({ control, onDecrease, onIncrease, onChange }) => (
  <div className="flex justify-between">
    <span className="text-sm font-bold uppercase">CHỌN SỐ LƯỢNG</span>
    <div className="flex border border-[#c4c4c4] rounded overflow-hidden w-fit">
      <button
        onClick={onDecrease}
        className="w-10 h-7 flex items-center justify-center border-r border-[#c4c4c4] text-gray-500 hover:bg-primary/5"
      >
        -
      </button>
      <Controller
        name="quantity"
        control={control}
        defaultValue={1}
        render={({ field }) => (
          <input
            min={1}
            value={field.value}
            onChange={(e) => onChange(e, field.onChange)}
            className="focus:ring-2 focus:ring-red-500 focus:border-red-500 w-10 h-7 text-center outline-none"
          />
        )}
      />
      <button
        onClick={onIncrease}
        className="w-10 h-7 flex items-center justify-center border-l border-[#c4c4c4] text-black hover:bg-primary/5"
      >
        +
      </button>
    </div>
  </div>
);

// Action Buttons Component
const ActionButtons: React.FC<{
  onSubmit: () => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => (
  <div className="flex flex-col gap-y-4 mb-5">
    <div className="flex items-center justify-between gap-x-3">
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="transition-shadow duration-300 ease-in-out hover:shadow-xl flex justify-center items-center gap-x-2 w-1/2 p-3 min-w-16 border-2 border-primary rounded outline-none select-none"
      >
        <Icon name="cart" size={24} />
        <p className="text-primary text-[14px] font-semibold leading-6 m-0">
          Thêm giỏ hàng
        </p>
      </button>
      <button
        onClick={onSubmit}
        type="button"
        className="transition-shadow duration-300 ease-in-out hover:shadow-xl flex justify-center items-center gap-x-2 w-1/2 p-3 min-w-16 border-2 border-primary bg-primary rounded outline-none select-none"
      >
        <Icon name="bag" size={24} />
        <p className="text-white text-[14px] font-semibold leading-6 m-0">
          Mua ngay
        </p>
      </button>
    </div>
    <button className="transition-shadow duration-300 ease-in-out hover:shadow-xl flex justify-center items-center gap-x-2 w-full p-3 min-w-16 border border-[#555555] rounded outline-none select-none">
      <Icon name="map" size={24} />
      <p className="text-black text-[14px] font-semibold leading-6 m-0">
        Cửa hàng có sẵn sản phẩm
      </p>
    </button>
  </div>
);

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const addToCartMutation = useAddToCartMutation();
  const { showError, showSuccess } = useToast();
  const { handleSubmit, control, watch, setValue, getValues } =
    useForm<AddToCartForm>({
      defaultValues: {
        color: "",
        size: "",
        quantity: 1,
      },
    });

  const selectedColor = watch("color");
  const selectedSize = watch("size");

  const availableColors: string[] = React.useMemo(() => {
    if (!product?.skus) return [];
    return Array.from(
      new Set(
        product?.skus
          .filter((sku: SKU) => sku.quantity !== 0)
          .map((sku: SKU) => sku.color)
      )
    );
  }, [product?.skus]);

  const skusForColor: SKU[] = React.useMemo(() => {
    return (
      product?.skus.filter((sku: SKU) => sku.color === selectedColor) || []
    );
  }, [product?.skus, selectedColor]);

  const { discountedPrice } = calculateDiscountedPrice({
    basePrice: product.price,
    discountType: product.discountType,
    discountValue: product.discountValue,
  });

  useEffect(() => {
    if (product && product.skus.length > 0) {
      const skus = product.skus;
      const firstColor = availableColors[0];
      setValue("color", firstColor);

      const sizesWithStock = skus.filter(
        (sku) => sku.color === firstColor && sku.quantity > 0
      );

      if (sizesWithStock.length > 0) {
        setValue("size", sizesWithStock[0].size);
      } else {
        setValue("size", "");
      }
    }
  }, [availableColors, product, setValue]);

  const handleDecrease = useCallback(() => {
    const current = getValues("quantity");
    if (current > 1) {
      setValue("quantity", current - 1);
    }
  }, [getValues, setValue]);

  const handleIncrease = useCallback(() => {
    const current = getValues("quantity");
    setValue("quantity", current + 1);
  }, [getValues, setValue]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (val: number) => void
    ) => {
      const value = parseInt(e.target.value);
      if (!isNaN(value) && value >= 1) {
        onChange(value);
      } else if (e.target.value === "") {
        onChange(1);
      }
    },
    []
  );

  const handleChangeColor = useCallback(
    (color: string) => {
      if (!product) return;
      setValue("color", color);
      const skusForColor = product.skus.filter((sku) => sku.color === color);

      const currentSku = skusForColor.find((sku) => sku.size === selectedSize);

      if (!currentSku || currentSku.quantity === 0) {
        const availableSize = skusForColor.find((sku) => sku.quantity > 0);
        setValue("size", availableSize?.size || "");
      }
    },
    [product, selectedSize, setValue]
  );

  const onSubmit = async (data: AddToCartForm) => {
    try {
      const productSkuId = skusForColor.find(
        (sku) =>
          sku.color === data.color &&
          sku.size === data.size &&
          sku.quantity >= data.quantity
      )?.id;
      if (!productSkuId) {
        showError("Sản phẩm không còn hàng");
        return;
      }
      const { message } = await addToCartMutation.mutateAsync({
        productSkuId: Number(productSkuId),
        quantity: data.quantity,
      });
      showSuccess(message);
    } catch (error) {
      handleRequestError(error);
    }
  };

  const debouncedSubmit = useDebounce(() => handleSubmit(onSubmit)(), 1000);

  return (
    <div className="lg:px-[117px] md:px-20 sm:px-10 px-5 font-font-poppins mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImageGallery images={product?.images || []} />
        <div className="h-screen">
          <h1 className="text-lg font-semibold leading-[24px] m-0">
            {product?.name}
          </h1>
          <div className="text-[14px] text-[#555555] mb-3">
            SKU:{" "}
            {skusForColor.find(
              (sku) =>
                sku.color === selectedColor &&
                sku.size === selectedSize &&
                sku.quantity !== 0
            )?.sku || "N/A"}
          </div>
          <div className="flex gap-1 items-center mb-6">
            <Rating
              name="half-rating"
              size="medium"
              readOnly
              value={product.rating || 0}
            />
            <h6 className="text-sm font-semibold leading-[18px]">{`${product.rating} sao`}</h6>
            <h6 className="text-sm font-normal leading-[14px] pl-[5px] text-[#525252] border-l-2 border-[#525252]">
              <span className="font-bold">{product.reviewCount}</span> đánh giá
            </h6>
            <h6 className="text-sm font-normal leading-[14px] pl-[5px] text-[#525252] border-l-2 border-[#525252]">
              <span className="font-bold">{product.soldCount || 0}</span> đã bán
            </h6>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-primary text-[24px] font-semibold leading-[30px]">
              {formatCurrency(discountedPrice)}
            </p>
            {product.stock > 0 && (
              <div className="flex gap-1 items-center">
                <p className="text-[16px] leading-6 font-semibold">Còn hàng</p>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.60124 1.34619C4.9279 1.34619 1.93457 4.33952 1.93457 8.01286C1.93457 11.6862 4.9279 14.6795 8.60124 14.6795C12.2746 14.6795 15.2679 11.6862 15.2679 8.01286C15.2679 4.33952 12.2746 1.34619 8.60124 1.34619ZM11.7879 6.47952L8.0079 10.2595C7.91457 10.3529 7.7879 10.4062 7.65457 10.4062C7.52124 10.4062 7.39457 10.3529 7.30124 10.2595L5.41457 8.37286C5.22124 8.17952 5.22124 7.85952 5.41457 7.66619C5.6079 7.47286 5.9279 7.47286 6.12124 7.66619L7.65457 9.19952L11.0812 5.77286C11.2746 5.57952 11.5946 5.57952 11.7879 5.77286C11.9812 5.96619 11.9812 6.27952 11.7879 6.47952Z"
                    fill="#00B578"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          <div className="mt-4 border-t border-dashed border-[#999999] pt-4 flex flex-col gap-6">
            <ProductColorSelector
              colors={availableColors}
              selectedColor={selectedColor}
              onColorChange={handleChangeColor}
            />
            <ProductSizeSelector
              skus={skusForColor}
              selectedSize={selectedSize}
              onSizeChange={(size) => setValue("size", size)}
            />
            <QuantitySelector
              control={control}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              onChange={handleChange}
            />
          </div>
          <div
            onClick={() => {
              dispatch(openModal({ type: ModalType.SIZE_GUIDE }));
            }}
            className="flex gap-2 items-center text-[13px] leading-[18px] my-4 cursor-pointer"
          >
            <svg
              width="25"
              height="10"
              viewBox="0 0 25 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.515508 10C0.44699 9.99935 0.379275 9.98516 0.316248 9.95825C0.253222 9.93133 0.196124 9.89222 0.148232 9.84317C0.100341 9.79411 0.0625972 9.73607 0.0371678 9.67238C0.0117383 9.60868 -0.00087643 9.54059 4.7298e-05 9.472V0.528C-0.00087643 0.459413 0.0117383 0.391319 0.0371678 0.327625C0.0625972 0.26393 0.100341 0.205889 0.148232 0.156832C0.196124 0.107776 0.253222 0.0686685 0.316248 0.0417552C0.379275 0.0148419 0.44699 0.000652049 0.515508 0L24.4585 0C24.527 0.000652049 24.5947 0.0148419 24.6577 0.0417552C24.7208 0.0686685 24.7779 0.107776 24.8257 0.156832C24.8736 0.205889 24.9114 0.26393 24.9368 0.327625C24.9622 0.391319 24.9749 0.459413 24.9739 0.528V9.472C24.9749 9.54059 24.9622 9.60868 24.9368 9.67238C24.9114 9.73607 24.8736 9.79411 24.8257 9.84317C24.7779 9.89222 24.7208 9.93133 24.6577 9.95825C24.5947 9.98516 24.527 9.99935 24.4585 10H0.515508ZM1.03097 8.941H23.943V1.059H22.5684V5.251C22.5684 5.38785 22.5141 5.5191 22.4175 5.61587C22.3208 5.71264 22.1897 5.767 22.053 5.767C21.9163 5.767 21.7852 5.71264 21.6885 5.61587C21.5918 5.5191 21.5375 5.38785 21.5375 5.251V1.059H19.6285L19.6065 3.746V3.753C19.6061 3.82076 19.5923 3.88777 19.566 3.9502C19.5396 4.01263 19.5013 4.06925 19.4531 4.11684C19.4049 4.16443 19.3478 4.20205 19.2851 4.22756C19.2224 4.25307 19.1553 4.26596 19.0876 4.2655C19.0199 4.26504 18.953 4.25124 18.8906 4.22488C18.8282 4.19853 18.7717 4.16013 18.7241 4.11189C18.6766 4.06365 18.639 4.00651 18.6135 3.94373C18.588 3.88095 18.5752 3.81376 18.5756 3.746V1.059H16.6666V5.251C16.6666 5.38785 16.6123 5.5191 16.5156 5.61587C16.419 5.71264 16.2879 5.767 16.1512 5.767C16.0144 5.767 15.8833 5.71264 15.7867 5.61587C15.69 5.5191 15.6357 5.38785 15.6357 5.251V1.059H13.7267V3.742C13.7267 3.87885 13.6724 4.0101 13.5757 4.10687C13.479 4.20364 13.3479 4.258 13.2112 4.258C13.0745 4.258 12.9434 4.20364 12.8467 4.10687C12.7501 4.0101 12.6958 3.87885 12.6958 3.742V1.059H10.7888V5.251C10.7888 5.31902 10.7754 5.38638 10.7494 5.44923C10.7234 5.51208 10.6853 5.56918 10.6372 5.61728C10.5892 5.66538 10.5321 5.70354 10.4693 5.72957C10.4065 5.7556 10.3393 5.769 10.2713 5.769C10.2034 5.769 10.1361 5.7556 10.0733 5.72957C10.0105 5.70354 9.95346 5.66538 9.90541 5.61728C9.85736 5.56918 9.81924 5.51208 9.79324 5.44923C9.76723 5.38638 9.75385 5.31902 9.75385 5.251V1.063H7.84284V3.746V3.761C7.84186 3.82876 7.82755 3.89567 7.80074 3.95789C7.77393 4.02012 7.73513 4.07645 7.68657 4.12367C7.63801 4.17089 7.58064 4.20807 7.51772 4.23309C7.45481 4.25811 7.38758 4.27048 7.31989 4.2695C7.2522 4.26851 7.18537 4.25419 7.1232 4.22735C7.06104 4.20051 7.00477 4.16168 6.9576 4.11306C6.91043 4.06445 6.87329 4.00702 6.84829 3.94404C6.8233 3.88105 6.81094 3.81376 6.81192 3.746V1.059H1.03097V8.941ZM2.55937 6.269C2.24927 5.94664 2.07603 5.51653 2.07603 5.069C2.07603 4.62147 2.24927 4.19136 2.55937 3.869C2.71195 3.71194 2.89444 3.58709 3.09605 3.50184C3.29765 3.41659 3.51429 3.37267 3.73314 3.37267C3.952 3.37267 4.16863 3.41659 4.37024 3.50184C4.57185 3.58709 4.75433 3.71194 4.90692 3.869C5.21701 4.19136 5.39026 4.62147 5.39026 5.069C5.39026 5.51653 5.21701 5.94664 4.90692 6.269C4.75433 6.42606 4.57185 6.55091 4.37024 6.63616C4.16863 6.72141 3.952 6.76533 3.73314 6.76533C3.51429 6.76533 3.29765 6.72141 3.09605 6.63616C2.89444 6.55091 2.71195 6.42606 2.55937 6.269ZM3.28361 4.607C3.16673 4.72959 3.10152 4.89254 3.10152 5.062C3.10152 5.23146 3.16673 5.39441 3.28361 5.517C3.28165 5.52766 3.28255 5.53866 3.28624 5.54885C3.28993 5.55904 3.29626 5.56807 3.30459 5.575C3.36443 5.63044 3.43493 5.67308 3.51179 5.70031C3.58866 5.72754 3.67026 5.73878 3.75161 5.73335C3.83297 5.72792 3.91236 5.70594 3.98493 5.66874C4.0575 5.63154 4.12173 5.5799 4.17368 5.517C4.29085 5.39381 4.35598 5.23009 4.35549 5.06C4.35641 4.89101 4.29114 4.72838 4.17368 4.607C4.11515 4.54775 4.04545 4.50071 3.96863 4.46862C3.89181 4.43652 3.80939 4.41999 3.72615 4.42C3.64364 4.41993 3.56195 4.43645 3.48594 4.46857C3.40992 4.50069 3.34112 4.54776 3.28361 4.607Z"
                fill="#222222"
              ></path>
            </svg>
            <span>Hướng dẫn kích thước</span>
          </div>
          <Link
            target="_blank"
            href={"https://zalo.me/0373635003"}
            className="flex items-center gap-[5px] text-[#2f5acf] font-bold text-[14px] mb-[15px]"
          >
            <Image
              src="/zalo.svg"
              alt="Next.js logo"
              width={30}
              height={30}
              priority
            />
            <p>Chat ngay để nhận tư vấn sản phẩm & ưu đãi</p>
            <span className="text-black ">
              <BsArrowRight size={20} />
            </span>
          </Link>
          <ActionButtons
            onSubmit={debouncedSubmit}
            isLoading={addToCartMutation.isPending}
          />
          <PolicyList />
        </div>
      </div>
      <div className="pt-[30px] flex flex-wrap w-full justify-center">
        <div className="flex justify-between w-2/3 border-b border-[#5555] pb-[30px]">
          <p className="font-bold text-lg leading-6 uppercase">
            Mô tả sản phẩm
          </p>
          <p className="p-0 text-sm font-normal leading-[18px]">
            Mã SP: 40003298
          </p>
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description),
          }}
          className="pt-3 w-2/3"
        ></p>
      </div>
      <div>
        <h6 className="text-lg font-semibold leading-6 uppercase my-6">
          ĐÁNH GIÁ TỪ NGƯỜI MUA
        </h6>
        <div className="flex my-6">
          <RatingSummary
            average={product.rating}
            totalReviews={product.reviewCount}
            breakdown={{ 5: 13, 4: 0, 3: 0, 2: 3, 1: 5 }}
          />
        </div>
        <CommentList productId={+product.id} />
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isFetching, error } = useProductBySlugQuery(
    slug || ""
  );
  const showLoading = useLoading({ isLoading, isFetching, delay: 0 });
  if (showLoading) return <Loading fullScreen size="large" />;
  if (!data?.data || error) return <NotFound />;

  return (
    <ProductDetail product={data.data} isLoading={isLoading} error={error} />
  );
};

export default ProductDetailPage;
