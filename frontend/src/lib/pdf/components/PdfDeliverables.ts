import jsPDF from "jspdf";

import { BuilderState } from "@/types/builder";

export function drawDeliverables(
  doc: jsPDF,
  builder: BuilderState,
  startY: number
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("Deliverables", 14, startY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let y = startY + 8;

  const items = [
    ["Edited Photos", builder.deliverables.editedPhotos],
    ["RAW Photos", builder.deliverables.rawPhotos],
    ["Cinematic Film", builder.deliverables.cinematicFilm],
    ["Teaser Film", builder.deliverables.teaserFilm],
    ["Instagram Reel", builder.deliverables.instagramReel],
    ["Wedding Album", builder.deliverables.album],
    ["Pendrive", builder.deliverables.pendrive],
    ["Cloud Gallery", builder.deliverables.cloudGallery],
  ];

  items.forEach(([label, enabled]) => {
    doc.text(
      `${enabled ? "✓" : "✗"} ${label}`,
      18,
      y
    );

    y += 7;
  });

  return y;
}