/* eslint-disable @next/next/no-img-element */
import { closeModal } from "@/redux/modalSlice";
import { useAppDispatch } from "@/redux/store";
import Image from "next/image";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const SizeGuideForm = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="w-[1000px]  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white pb-4 shadow-lg">
      <div className="p-2 flex justify-end cursor-pointer">
        <IoCloseOutline
          onClick={() => dispatch(closeModal())}
          className="w-8 h-8"
        />
      </div>
      <div className="max-h-[80vh] overflow-y-scroll px-4 pb-4">
        <Image
          src="/size_guide.webp"
          alt="Size Guide"
          width={800}
          height={0}
          className="w-full h-auto block"
          priority
        />
      </div>
    </div>
  );
};

export default SizeGuideForm;
