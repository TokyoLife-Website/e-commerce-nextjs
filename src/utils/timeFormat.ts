import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";

// Extend dayjs with plugins

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale("vi");

/**
 * Format thời gian từ timestamp thành chuỗi relative time (VD: "2 phút trước", "1 giờ trước")
 */
export const formatTimeAgo = (timestamp: string | Date): string => {
  try {
    return dayjs.utc(timestamp).local().fromNow();
  } catch (error) {
    return "";
  }
};

/**
 * Format thời gian ngắn gọn (VD: "2m", "1h", "3d")
 */
export const formatTimeShort = (timestamp: string | Date): string => {
  try {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffInSeconds = now.diff(date, "second");

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else {
      return date.format("DD/MM");
    }
  } catch (error) {
    return "";
  }
};

/**
 * Kiểm tra người dùng có online không (dựa trên lastMessage time)
 * Coi là online nếu tin nhắn cuối trong vòng 5 phút
 */
export const isUserOnline = (lastMessageTime?: string): boolean => {
  if (!lastMessageTime) return false;

  try {
    const lastTime = dayjs(lastMessageTime);
    const now = dayjs();
    const diffInMinutes = now.diff(lastTime, "minute");
    return diffInMinutes <= 1000;
  } catch (error) {
    return false;
  }
};
