import React, { useState } from "react";
import CustomButton from "../layouts/CustomBtn";

interface ProductOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (color: string, size: number) => void;
}

const colors = ["Đen", "Trắng"];
const sizes = [35, 36, 37, 38, 39, 40];

const EditCartItemOptionsModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ProductOptionsModalProps) => {
  const [selectedColor, setSelectedColor] = useState("Trắng");
  const [selectedSize, setSelectedSize] = useState(40);

  const handleConfirm = () => {
    onConfirm(selectedColor, selectedSize);
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
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    selectedColor === color
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${
                      color === "Đen" ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div>
            <p className="font-medium">
              Kích thước: <span className="font-bold">Size {selectedSize}</span>
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border rounded-md py-2 text-sm font-medium flex items-center justify-center relative ${
                    selectedSize === size
                      ? "border-primary text-primary"
                      : "border-gray-300"
                  }`}
                >
                  Size {size}
                </button>
              ))}
            </div>
          </div>

          {/* Hành động */}
          <div className="flex mt-4 gap-2 justify-between">
            <CustomButton
              onClick={onClose}
              className=" border border-gray-300 bg-white text-black w-1/2 hover:bg-primary hover:text-white transition-all duration-300"
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
