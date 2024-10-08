import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { NextApiRequest, NextApiResponse } from "next";
import sizeOf from "image-size"; // Built-in package for image dimensions

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    const doc = new Document({
      sections: [
        {
          children: [],
        },
      ],
    });

    for (const item of data) {
      if (item.type === "text" || item.type === "thinking") {
        const textLines = item.data.split("\n").map(
          (line: string) =>
            new Paragraph({
              children: [new TextRun(line)],
            }),
        );
        doc.addSection({
          children: textLines,
        });
      } else if (item.type === "artifact") {
        const base64Image = item.data.split(",")[1];
        const imageBuffer = Buffer.from(base64Image, "base64");

        // Get original image dimensions
        const dimensions = sizeOf(imageBuffer);
        const originalWidth = dimensions.width;
        const originalHeight = dimensions.height;

        doc.addSection({
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

    const buffer = await Packer.toBuffer(doc);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", 'attachment; filename="document.docx"');
    res.send(buffer);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    res.status(500).json({ message: "Error generating DOCX" });
  }
}
