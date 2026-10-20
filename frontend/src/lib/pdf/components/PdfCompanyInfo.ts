import jsPDF from "jspdf";

export function drawCompanyInfo(
  doc: jsPDF
) {
  doc.setDrawColor(220);

  doc.roundedRect(
    14,
    45,
    86,
    34,
    3,
    3
  );

  doc.setFontSize(13);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "VK Creation Studio",
    18,
    53
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(10);

  doc.text(
    "Wedding Photography",
    18,
    60
  );

  doc.text(
    "Indore, Madhya Pradesh",
    18,
    66
  );

  doc.text(
    "+91 XXXXX XXXXX",
    18,
    72
  );

  doc.text(
    "vkcreationstudio@gmail.com",
    18,
    78
  );
}