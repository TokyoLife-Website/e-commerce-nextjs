import React, { useState, useMemo } from "react";
import CustomButton from "../layouts/CustomBtn";
import { CartItem } from "@/types/cartItem";

interface ProductOptionsModalProps {
  item: CartItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (skuId: number) => void;
}

const EditCartItemOptionsModal = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}: ProductOptionsModalProps) => {
  const [selectedColor, setSelectedColor] = useState(item.sku.color);
  const [selectedSize, setSelectedSize] = useState(item.sku.size);
  console.log(item);
  // Get unique colors and sizes from available SKUs
  const { colors, sizes, availableCombinations } = useMemo(() => {
    const skus = item.sku.product.skus;

    // Get unique colors and sizes
    const uniqueColors = Array.from(new Set(skus.map((sku) => sku.color)));
    const uniqueSizes = Array.from(new Set(skus.map((sku) => sku.size)));

    // Create a map of available combinations
    const combinations = new Map<string, boolean>();
    skus.forEach((sku) => {
      const key = `${sku.color}-${sku.size}`;
      combinations.set(key, sku.quantity > 0);
    });

    return {
      colors: uniqueColors,
      sizes: uniqueSizes,
      availableCombinations: combinations,
    };
  }, [item.sku.product.skus]);

  // Check if a color is available for any size
  const isColorAvailable = (color: string) => {
    return sizes.some((size) => {
      const key = `${color}-${size}`;
      return availableCombinations.get(key);
    });
  };

  // Check if a size is available for the selected color
  const isSizeAvailable = (size: string) => {
    const key = `${selectedColor}-${size}`;
    return availableCombinations.get(key);
  };

  const handleColorSelect = (color: string) => {
    if (isColorAvailable(color)) {
      setSelectedColor(color);
      // Find first available size for this color
      const availableSize = sizes.find((size) => {
        const key = `${color}-${size}`;
        return availableCombinations.get(key);
      });
      if (availableSize) {
        setSelectedSize(availableSize);
      }
    }
  };

  const handleSizeSelect = (size: string) => {
    if (isSizeAvailable(size)) {
      setSelectedSize(size);
    }
  };

  const handleConfirm = () => {
    const skuId =
      item.sku.product.skus.find(
        (sku) => sku.color === selectedColor && sku.size === selectedSize
      )?.id || 0;
    onConfirm(+skuId);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 z-10 bg-black bg-opacity-40 shadow-xl rounded-lg">
      {/* Modal content */}
      <div className="bg-white p-6 w-[350px]">
        <div className="space-y-4">
          {/* Màu sắc */}
          <div>
            <p className="font-medium">
              Màu sắc: <span className="font-bold">{selectedColor}</span>
            </p>
            <div className="flex gap-3 mt-2">
              {colors.map((color) => {
                const isAvailable = isColorAvailable(color);
                return (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    disabled={!isAvailable}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      selectedColor === color
                        ? "border-primary"
                        : "border-gray-300"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kích thước */}
          <div>
            <p className="font-medium">
              Kích thước: <span className="font-bold">Size {selectedSize}</span>
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {sizes.map((size) => {
                const isAvailable = isSizeAvailable(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    disabled={!isAvailable}
                    className={`border rounded-md py-2 text-sm font-medium flex items-center justify-center relative ${
                      selectedSize === size
                        ? "border-primary text-primary"
                        : "border-gray-300"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Size {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hành động */}
          <div className="flex mt-4 gap-2 justify-between">
            <CustomButton
              onClick={onClose}
              className="border border-gray-300 bg-white text-black w-1/2 hover:bg-primary hover:text-white transition-all duration-300"
              size="small"
            >
              Trở lại
            </CustomButton>
            <CustomButton
              onClick={handleConfirm}
              className="text-white w-1/2"
              size="small"
            >
              Xác nhận
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCartItemOptionsModal;
