export function generateBookingNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return 'VKCREATION-' + dateStr + '-' + randomStr;
}
export default generateBookingNumber;
