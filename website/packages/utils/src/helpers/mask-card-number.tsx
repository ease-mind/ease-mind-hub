export function maskCardNumber(cardNumber: number | string): string {
  const digits = cardNumber.toString().replace(/\D/g, "");
  const lastFour = digits.slice(-4);
  return "**** **** **** " + lastFour;
}