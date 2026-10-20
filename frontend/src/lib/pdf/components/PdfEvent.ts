import jsPDF from "jspdf";

import { BuilderState } from "@/types/builder";

export function drawEvent(
  doc: jsPDF,
  builder: BuilderState
) {
  doc.setFontSize(13);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Wedding Details",
    110,
    90
  );

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Bride : ${builder.event.brideName || "-"}`,
    114,
    98
  );

  doc.text(
    `Groom : ${builder.event.groomName || "-"}`,
    114,
    105
  );

  doc.text(
    `Event : ${builder.event.eventType || "-"}`,
    114,
    112
  );

  doc.text(
    `Date : ${builder.event.eventDate || "-"}`,
    114,
    119
  );

  doc.text(
    `Venue : ${builder.event.venue || "-"}`,
    114,
    126
  );
}