import { useMutation } from "@tanstack/react-query";
import axiosInstance from "./axios";

const uploadSingleImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post("/multer/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const uploadmultipleImages = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await axiosInstance.post("/multer/multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useUploadImagesMutation = () => {
  return useMutation({
    mutationFn: uploadmultipleImages,
  });
};

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: (file: File) => uploadSingleImage(file),
  });
};
