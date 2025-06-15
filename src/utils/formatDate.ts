import dayjs from "dayjs";

export const formatDate = (
  isoString: string | Date,
  format = "DD/MM/YYYY HH:mm:ss"
) => {
  return dayjs(isoString).format(format);
};
