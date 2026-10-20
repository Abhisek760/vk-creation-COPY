export function generateInvoicePdf(booking: any = {}): void {
  const cust = booking?.customer || {};
  const evt = booking?.event || {};
  const history = Array.isArray(booking?.paymentHistory) ? booking.paymentHistory : [];

  const name = cust?.name || booking?.customerName || '';
  const phone = cust?.phone || booking?.customerPhone || '';
  const email = cust?.email || booking?.customerEmail || '';

  const subtotal = Number(booking?.subtotal || 0);
  const grandTotal = Number(booking?.grandTotal || 0);
  const advance = Number(booking?.advancePaid || 0);
  const remaining = Number(booking?.remainingAmount || 0);

  const formattedRows = history.map((p: any) => [
    p?.id || '',
    '? ' + Number(p?.amount || 0).toLocaleString('en-IN'),
    p?.paidAt || p?.date || '',
  ]);
}
export default generateInvoicePdf;
