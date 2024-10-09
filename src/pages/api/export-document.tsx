import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { NextApiRequest, NextApiResponse } from "next";
import sizeOf from "image-size";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { data, format }: { data: any; format: string } = req.body;

  if (!data || !Array.isArray(data)) {
    res.status(400).json({ message: "Invalid data format" });
    return;
  }

  if (!format || !["pdf", "docx"].includes(format)) {
    res.status(400).json({ message: "Invalid format. Use 'pdf' or 'docx'" });
    return;
  }

  try {
    if (format === "pdf") {
      // PDF Generation
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
    } else if (format === "docx") {
      // DOCX Generation
      const sections = [];

      for (const item of data) {
        if (item.type === "text" || item.type === "thinking") {
          const textLines = item.data.split("\n").map(
            (line: string) =>
              new Paragraph({
                children: [new TextRun(line)],
              }),
          );
          sections.push({
            children: textLines,
          });
        } else if (item.type === "artifact") {
          const base64Image: string = item.data.split(",")[1];
          const imageBuffer = Buffer.from(base64Image, "base64");

          const dimensions = sizeOf(imageBuffer);
          const originalWidth = dimensions.width ?? 100;
          const originalHeight = dimensions.height ?? 100;

          sections.push({
            children: [
              new Paragraph({
                alignment: "center",
                children: [
                  new ImageRun({
                    data: imageBuffer,
                    transformation: { width: originalWidth, height: originalHeight },
                  }),
                ],
              }),
            ],
          });
        }
      }

      const doc = new Document({ sections });
      const buffer = await Packer.toBuffer(doc);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", 'attachment; filename="document.docx"');
      res.send(buffer);
    }
  } catch (error) {
    console.error("Error generating document:", error);
    res.status(500).json({ message: `Error generating ${format}` });
  }
}
