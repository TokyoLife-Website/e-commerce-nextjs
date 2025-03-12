"use client";
import CustomButton from "@/components/layouts/CustomBtn";
import DateInput from "@/components/inputs/DateInput";
import SelectInput from "@/components/inputs/SelectInput";
import TextInput from "@/components/inputs/TextInput";
import {
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from "@/hooks/api/user.api";
import useToast from "@/hooks/useToastify";
import { RootState, useAppSelector } from "@/redux/store";
import {
  personalInfoFormData,
  personalInfoSchema,
} from "@/schemas/personalInfoSchema";
import { Gender } from "@/types/gender";
import { convertToBase64 } from "@/utils/converToBase64";
import { handleRequestError } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const defaultValues: personalInfoFormData = {
  avatar: "",
  firstName: "",
  lastName: "",
  dob: dayjs().toDate(),
  gender: Gender.MALE,
  phone: "",
  email: "",
};

export default function PeronalInfo() {
  const { showSuccess } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const userData = useAppSelector((state: RootState) => state.user);
  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setValue("avatar", base64);
        setFile(file);
      } catch (error) {
        console.error("Failed to convert file to base64:", error);
      }
    }
  };

  const {
    control,
    getValues,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<personalInfoFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(personalInfoSchema),
  });

  useEffect(() => {
    if (userData) {
      reset({
        avatar: userData.avatar?.url || "/upload.jpg",
        firstName: userData.firstName,
        lastName: userData.lastName,
        dob: userData.dob ? dayjs(userData.dob).toDate() : dayjs().toDate(),
        gender: userData.gender,
        phone: userData.phone,
        email: userData.email,
      });
    }
  }, [userData, reset]);

  const { mutateAsync } = useUpdateUserMutation();
  const { mutateAsync: uploadAvatar } = useUploadAvatarMutation();

  const onSubmit: SubmitHandler<personalInfoFormData> = async (payload) => {
    try {
      if (file) {
        await uploadAvatar(file);
        setFile(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { avatar, ...other } = payload;
      const { message } = await mutateAsync(other);
      showSuccess(message);
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
            src={getValues("avatar") || "/upload.jpg"}
            className="rounded-full w-[120px] h-[120px] object-cover  mx-auto mb-6"
            alt="Avatar"
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
            <div className="flex items-start gap-5 mb-[15px] w-full">
              <TextInput
                name="lastName"
                control={control}
                errMsg={errors.lastName?.message}
                isError={!!errors.lastName}
                size="small"
                placeHolder="Nhập họ của bạn"
              />
              <TextInput
                name="firstName"
                control={control}
                errMsg={errors.firstName?.message}
                isError={!!errors.firstName}
                size="small"
                placeHolder="Nhập tên của bạn"
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Ngày sinh
            </label>
            <div className="w-full">
              <DateInput
                name="dob"
                size="small"
                control={control}
                isError={!!errors.dob}
                errMsg={errors.dob?.message}
                disabledFuture
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Giới tính
            </label>
            <div className="w-full">
              <SelectInput
                name="gender"
                size="small"
                control={control}
                isError={!!errors.gender}
                errMsg={errors.gender?.message}
                options={[
                  { id: Gender.MALE, name: "Nam" },
                  { id: Gender.FEMALE, name: "Nữ" },
                  { id: Gender.OTHER, name: "Khác" },
                ]}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Số điện thoại
            </label>
            <div className="w-full">
              <TextInput
                disabled
                name="phone"
                control={control}
                placeHolder="Nhập số điện thoại"
                size="small"
                isRequired
                errMsg={errors.phone?.message}
                isError={!!errors.phone}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="name" className="text-[#525252] min-w-[30%]">
              Email
            </label>
            <div className="w-full">
              <TextInput
                disabled
                name="email"
                control={control}
                placeHolder="Nhập email của bạn"
                size="small"
                isRequired
                errMsg={errors.email?.message}
                isError={!!errors.email}
              />
            </div>
          </div>
        </div>
      </div>
      <CustomButton className="text-white ml-auto">Lưu thay đổi</CustomButton>
    </form>
  );
}
