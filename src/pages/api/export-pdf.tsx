import PDFDocument from "pdfkit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    // Create a new PDF document
    const pdfDoc = new PDFDocument({
      autoFirstPage: false, // Control page creation manually
    });

    // Set headers for downloadable PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="document.pdf"');

    // Pipe PDF document directly to the response
    pdfDoc.pipe(res);

    // Define page dimensions and layout settings
    const margin = 50;
    const pageWidth = 595.28; // Standard A4 width in points
    const pageHeight = 841.89; // Standard A4 height in points
    const maxTextWidth = pageWidth - 2 * margin;

    // Add the first page
    pdfDoc.addPage({
      size: "A4",
      margins: { top: margin, bottom: margin, left: margin, right: margin },
    });

    for (const item of data) {
      if (item.type === "text" || item.type === "thinking") {
        const textLines = item.data.split("\n"); // Split the text into lines

        for (const line of textLines) {
          const height = pdfDoc.heightOfString(line, { width: maxTextWidth });

          // Check if the current position + text height exceeds the page height
          if (pdfDoc.y + height > pageHeight - margin) {
            pdfDoc.addPage(); // Add a new page if not enough space
          }

          pdfDoc.text(line, {
            width: maxTextWidth,
            lineGap: 4,
          });
        }

        pdfDoc.moveDown(2); // Add spacing after the text
      } else if (item.type === "artifact") {
        const base64Image = item.data;
        const base64Data = base64Image.split(",")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");

        const imageHeight = pageHeight / 2;

        // Check if the image fits on the current page
        if (pdfDoc.y + imageHeight > pageHeight - margin) {
          pdfDoc.addPage(); // Add a new page if the image doesn't fit
        }

        // Insert the image
        pdfDoc.image(imageBuffer, {
          fit: [pageWidth - 2 * margin, imageHeight],
          align: "center",
          valign: "top",
        });

        // Move the cursor below the image
        pdfDoc.moveDown(1);

        // Update y position manually to ensure we move past the image height
        pdfDoc.y += imageHeight;
      }
    }

    // Finalize the PDF and end the response
    pdfDoc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
}
