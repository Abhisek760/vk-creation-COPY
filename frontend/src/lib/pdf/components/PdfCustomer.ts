import jsPDF from "jspdf";

import { BuilderState } from "@/types/builder";

export function drawCustomer(
  doc: jsPDF,
  builder: BuilderState
) {
  doc.setFontSize(13);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Customer Details",
    14,
    90
  );

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Name : ${builder.customer.name || "-"}`,
    18,
    98
  );

  doc.text(
    `Phone : ${builder.customer.phone || "-"}`,
    18,
    105
  );

  doc.text(
    `Email : ${builder.customer.email || "-"}`,
    18,
    112
  );
}