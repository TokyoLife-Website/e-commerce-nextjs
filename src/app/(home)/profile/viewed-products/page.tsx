"use client";
import SearchItem from "@/components/header/SearchItem";
import { useAppSelector } from "@/redux/store";
import { Product } from "@/types/product";

export default function Home() {
  const viewedProducts = useAppSelector(
    (state) => state.viewedProduct.viewedProducts
  );
  return (
    <div className="font-font-poppins">
      <div className="uppercase font-extrabold leading-6 text-xl mb-6 pb-6 border-b">
        Sản phẩm đã xem
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {viewedProducts.map((product) => (
          <SearchItem
            key={product.id}
            product={
              {
                id: product.id,
                name: product.name,
                price: product.price,
                finalPrice: product.finalPrice,
                discountType: product.discountType,
                discountValue: product.discountValue,
                slug: product.slug,
                images: [product.image],
              } as unknown as Product
            }
          />
        ))}
      </div>
    </div>
  );
}
