export const formatPrice = (value: number, currency: string = "USD"): string => {
  const locale = currency === "USD" ? "en-US" : "en-GB";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    
    maximumFractionDigits: 0,
  }).format(value);
};


export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}