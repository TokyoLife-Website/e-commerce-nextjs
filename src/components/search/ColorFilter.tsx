"use client";

import clsx from "clsx";
import { Color } from "@/types/color";

interface FilterColorProps {
  selectedColor: Color | null;
  onChange: (color: Color) => void;
}

export const FilterColor: React.FC<FilterColorProps> = ({
  selectedColor,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold py-4 text-base">Màu sắc</h2>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {Object.values(Color).map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={clsx(
              "w-6 h-6 rounded-full border transition-all duration-200",
              {
                "border-2 border-black": selectedColor === color,
                "border border-gray-300": selectedColor !== color,
              }
            )}
            style={{ backgroundColor: color.toLowerCase() }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
