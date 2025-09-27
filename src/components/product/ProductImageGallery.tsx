"use client";
import React, { useState } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Thumbs,
} from "swiper/modules";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/scrollbar";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  return (
    <div className="flex gap-8 h-fit">
      <div className="w-20 h-[400px] hidden sm:block">
        <Swiper
          direction="vertical"
          spaceBetween={0}
          freeMode={true}
          watchSlidesProgress={true}
          loop={true}
          slidesPerView={4}
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          className="h-full"
        >
          {images.map((image: string, index: number) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-20">
                <Image
                  fill
                  src={image}
                  alt={`Slide ${index}`}
                  className="object-cover cursor-pointer"
                  sizes="80px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        thumbs={{ swiper: thumbsSwiper }}
        className="w-full h-full"
      >
        {images.map((image: string, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[700px]">
              <Image
                fill
                src={image}
                alt={`Slide ${index}`}
                className="object-contain"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </SwiperSlide>
        ))}
        <div className="w-7 h-11 flex items-center justify-center swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-md cursor-pointer hover:bg-black">
          <GrPrevious size={32} />
        </div>
        <div className="w-7 h-11 flex items-center justify-center swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-md cursor-pointer hover:bg-black">
          <GrNext size={32} />
        </div>
      </Swiper>
    </div>
  );
};

export default ProductImageGallery;
