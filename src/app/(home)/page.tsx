"use client";
import { SectionTitle } from "@/components/inputs/SectionTitle";
import ProductItem from "@/components/product/ProductItem";
import { useProductsQuery } from "@/hooks/api/product.api";

export default function Home() {
  const { data } = useProductsQuery(1, 50);
  const productList = data?.data.items || [];
  return (
    <div className="mx-5 mt-10 sm:mx-10 md:mx-20 lg:mx-40 font-font-poppins">
      <SectionTitle title="CÓ TOKYOLIFE TẾT AI CŨNG VUI!" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4 p-4">
        {productList.length > 0 &&
          productList?.map((item) => (
            <ProductItem key={item.slug} product={item} />
          ))}
      </div>
    </div>
  );
}
