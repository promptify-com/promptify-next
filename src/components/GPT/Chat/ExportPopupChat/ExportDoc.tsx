import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { GetAppRounded } from "@mui/icons-material";
import WordIcon from "@/assets/icons/WordIcon";
import useScreenshot from "@/hooks/useScreenshot";

interface Props {
  title: string;
  content: string;
}

const ExportDoc = ({ title, content }: Props) => {
  const { captureScreenshots } = useScreenshot("artifact");
  const [loading, setLoading] = useState<boolean>(false);

  const handleExportDoc = async () => {
    setLoading(true);
    const data = [];
    if (!content) return;
    const capturedImages = await captureScreenshots();
    const parts = content.split(/(<\/?antThinking>|<\/?antArtifact)/g);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]?.trim();
      if (part.startsWith("<antThinking>")) {
        const content = parts[++i]?.trim();
        data.push({ type: "thinking", data: content });
      } else if (part.startsWith("<antArtifact")) {
        const content = parts[++i]?.trim();
        data.push({ type: "artifact", data: capturedImages?.[`artifact-${i}`] });
      } else if (part && !part.startsWith("<")) {
        const content = parts[++i]?.trim();
        data.push({ type: "text", data: part });
      }
    }
    setLoading(false);
    console.log(data);
    // Send the captured data to the API
    try {
      const response = await fetch("/api/export-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title
        .replace(/[\s,:]+/g, "-")
        .replace(/-+/g, "-")
        .trim()}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      direction="row"
      sx={{ p: 2 }}
      spacing={3}
      alignItems="center"
    >
      <WordIcon />
      <Stack sx={{ justifyContent: "space-between", flexGrow: 1 }}>
        <Typography
          fontSize={14}
          lineHeight={"143%"}
          fontWeight={500}
          sx={{ opacity: 0.8 }}
        >
          Export as Word Document
        </Typography>
        <Typography
          fontSize={12}
          sx={{ opacity: 0.5 }}
        >
          {title
            .replace(/[\s,:]+/g, "-")
            .replace(/-+/g, "-")
            .trim()}
          .docx
        </Typography>
      </Stack>
      <IconButton
        onClick={handleExportDoc}
        sx={{ border: "none", opacity: 0.6, justifyContent: "center", alignItems: "center" }}
      >
        {loading ? <CircularProgress size={16} /> : <GetAppRounded />}
      </IconButton>
    </Stack>
  );
};

export default ExportDoc;
