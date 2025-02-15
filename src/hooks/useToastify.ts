import { toast, ToastOptions } from "react-toastify";

const useToast = () => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  };
  const showSuccess = (message: string) => {
    toast.success(message, options);
  };

  const showError = (message: string) => {
    toast.error(message, options);
  };

  const showWarning = (message: string) => {
    toast.warning(message, options);
  };

  const showInfo = (message: string) => {
    toast.info(message, options);
  };

  return { showSuccess, showError, showWarning, showInfo };
};

export default useToast;
