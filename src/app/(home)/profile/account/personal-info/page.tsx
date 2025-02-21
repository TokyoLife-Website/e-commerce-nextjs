"use client";
import CustomButton from "@/components/CustomBtn";
import TextInput from "@/components/TextInput";
import { useUpdatePasswordMutation } from "@/hooks/api/user.api";
import useToast from "@/hooks/useToastify";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/schemas/changePasswordSchema";
import { handleRequestError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function PeronalInfo() {
  const { showSuccess } = useToast();
  const [avatar, setAvatar] = useState<string>("");
  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setAvatar(base64);
      } catch (error) {
        console.error("Failed to convert file to base64:", error);
      }
    }
  };
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("File conversion failed."));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutateAsync } = useUpdatePasswordMutation();
  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (payload) => {
    try {
      const { message } = await mutateAsync(payload);
      showSuccess(message);
      reset(defaultValues);
    } catch (error) {
      handleRequestError(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
      <div className="uppercase font-extrabold leading-6 text-xl mb-6 pb-6 border-b">
        Hồ sơ của tôi
      </div>
      <div className="flex items-center w-full">
        <div className="text-center mr-[30px] pr-[30px] border-r">
          <Image
            src={avatar || "/upload.jpg"}
            className="rounded-full w-[120px] h-[120px] object-cover  mx-auto mb-6"
            alt={""}
            width={120}
            height={120}
          ></Image>
          <label
            htmlFor="uploadAvt"
            className="border border-[rgb(238,238,238)] rounded py-[3px] px-[12px] leading-[18px] text-[#333333]"
          >
            Chọn ảnh
            <input
              id="uploadAvt"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </label>
          <div className="mt-3 text-[#737373] text-sm leading-[18px]">
            Dung lượng tối đa 1MB. Định dạng .JPEG, .PNG
          </div>
        </div>
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Họ và tên
            </label>
            <div className="w-full">
              <TextInput
                name="currentPassword"
                control={control}
                placeHolder="Nhập mật khẩu"
                size="small"
                isRequired
                errMsg={errors.currentPassword?.message}
                isError={!!errors.currentPassword}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Ngày sinh
            </label>
            <div className="w-full">
              <TextInput
                name="currentPassword"
                control={control}
                placeHolder="Nhập mật khẩu"
                size="small"
                isRequired
                errMsg={errors.currentPassword?.message}
                isError={!!errors.currentPassword}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Giới tính
            </label>
            <div className="w-full">
              <TextInput
                name="currentPassword"
                control={control}
                placeHolder="Nhập mật khẩu"
                size="small"
                isRequired
                errMsg={errors.currentPassword?.message}
                isError={!!errors.currentPassword}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Số điện thoại
            </label>
            <div className="w-full">
              <TextInput
                name="currentPassword"
                control={control}
                placeHolder="Nhập mật khẩu"
                size="small"
                isRequired
                errMsg={errors.currentPassword?.message}
                isError={!!errors.currentPassword}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Email
            </label>
            <div className="w-full">
              <TextInput
                name="currentPassword"
                control={control}
                placeHolder="Nhập mật khẩu"
                size="small"
                isRequired
                errMsg={errors.currentPassword?.message}
                isError={!!errors.currentPassword}
              />
            </div>
          </div>
        </div>
      </div>
      <CustomButton className="text-white ml-auto">Lưu thay đổi</CustomButton>
    </form>
  );
}
