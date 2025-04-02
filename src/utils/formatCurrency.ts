export const formatCurrency = (
  amount: number | string,
  currency: string = "VND",
  locale: string = "vi-VN"
) => {
  const number = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(number)) return "0 ₫"; // Xử lý nếu giá trị không hợp lệ

  return number.toLocaleString(locale, { style: "currency", currency });
};
