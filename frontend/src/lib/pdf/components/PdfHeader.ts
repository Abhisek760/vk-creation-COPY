export function drawPdfHeader(doc: any, title: string = 'Invoice'): void {
  try {
    doc.setFontSize(20);
    doc.text(title, 14, 20);
  } catch (e) {
    // pdf header fallback
  }
}
export default drawPdfHeader;
