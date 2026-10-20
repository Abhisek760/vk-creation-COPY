export function generateBookingNumber(): string {
const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
  return `VKCREATION-${randomDigits}`;
}