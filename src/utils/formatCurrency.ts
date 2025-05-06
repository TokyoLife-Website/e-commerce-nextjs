export const formatCurrency = (amount: number | string): string => {
  const number = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(number)) return "0đ";

  return (
    number
      .toFixed(0) // không lấy phần thập phân
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"
  );
};
