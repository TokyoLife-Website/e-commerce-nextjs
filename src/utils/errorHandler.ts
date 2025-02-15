import useToast from "@/hooks/useToastify";
import axios from "axios";

export const handleRequestError = (error: unknown) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { showError } = useToast();
  if (axios.isAxiosError(error)) {
    const message = error?.response?.data?.message;
    showError(message);
  } else {
    showError("Some thing went wrong, please try again!");
  }
};
