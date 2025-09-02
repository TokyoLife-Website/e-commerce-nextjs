import React from "react";
import { FaStar } from "react-icons/fa";
import ComponentCard from "@/components/admin/common/ComponentCard";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

interface TopProductsProps {
  products: Product[];
}

const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  const router = useRouter();
  const handleProductClick = (productId: number) => {
    router.push(`/admin/products/${productId}`);
  };

  return (
    <ComponentCard
      title="Top Selling Products"
      desc="Top products by sales volume"
    >
      <div className="space-y-4">
        {products?.map((product, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => handleProductClick(+product.id)}
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src={product.images[0]}
                  alt="Product"
                  className="w-10 h-10 rounded object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  <FaStar className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-gray-600 ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">
                  {product.soldCount} sold
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(product.finalPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ComponentCard>
  );
};

export default TopProducts;
