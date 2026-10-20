export function drawPdfServicesTable(doc: any, builder: any, startY: number = 100): number {
  if (!builder || !Array.isArray(builder.services)) return startY + 20;
  try {
    const rows = builder.services.map((selected: any) => [
      selected?.name || 'Service',
      '? ' + Number(selected?.price || 0).toLocaleString('en-IN'),
    ]);
  } catch (e) {
    // fallback handling
  }
  return startY + 40;
}

export const drawServicesTable = drawPdfServicesTable;
export default drawPdfServicesTable;
