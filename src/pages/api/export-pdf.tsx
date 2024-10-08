import PDFDocument from "pdfkit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    res.status(400).json({ message: "Invalid data format" });
    return;
  }

  try {
    const pdfDoc = new PDFDocument({
      autoFirstPage: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="document.pdf"');

    pdfDoc.pipe(res);

    const margin = 50;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const maxTextWidth = pageWidth - 2 * margin;

    pdfDoc.addPage({
      size: "A4",
      margins: { top: margin, bottom: margin, left: margin, right: margin },
    });

    for (const item of data) {
      if (item.type === "text" || item.type === "thinking") {
        const textLines: string[] = item.data.split("\n");

        for (const line of textLines) {
          const height = pdfDoc.heightOfString(line, { width: maxTextWidth });

          if (pdfDoc.y + height > pageHeight - margin) {
            pdfDoc.addPage();
          }

          pdfDoc.text(line, {
            width: maxTextWidth,
            lineGap: 4,
          });
        }

        pdfDoc.moveDown(2);
      } else if (item.type === "artifact") {
        const base64Image: string = item.data;
        const base64Data: string = base64Image.split(",")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");

        const imageHeight = pageHeight / 2;

        if (pdfDoc.y + imageHeight > pageHeight - margin) {
          pdfDoc.addPage();
        }

        pdfDoc.image(imageBuffer, margin, pdfDoc.y, {
          fit: [pageWidth - 2 * margin, imageHeight],
          align: "center",
          valign: "bottom",
        });

        pdfDoc.moveDown(1);
        pdfDoc.y += imageHeight;
      }
    }

    pdfDoc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
}
