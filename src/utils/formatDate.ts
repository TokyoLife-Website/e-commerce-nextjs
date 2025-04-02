import dayjs from "dayjs";

export const formatDate = (
  isoString: string,
  format = "DD/MM/YYYY HH:mm:ss"
) => {
  return dayjs(isoString).format(format);
};
