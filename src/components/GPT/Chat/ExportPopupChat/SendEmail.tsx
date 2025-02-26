import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Email from "@mui/icons-material/Email";
import ShareIcon from "@/assets/icons/ShareIcon";
import useScreenshot from "@/hooks/useScreenshot";

interface Props {
  title: string;
  content: string;
}

const SendEmail = ({ title, content }: Props) => {
  const { captureScreenshots } = useScreenshot("artifact");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendEmail = async () => {
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
    // Format the email content
    const subject = encodeURIComponent(`New Email from: ${title}`);
    const bodyParts = data
      .map(section => {
        if (section?.type === "text") {
          return section?.data;
        } else if (section?.type === "thinking") {
          return `Thinking: ${section?.data}`;
        } else if (section.type === "artifact") {
          return `![Artifact Image](${section?.data})`;
        }
        return "";
      })
      .join("\n\n");

    const body = encodeURIComponent(bodyParts);

    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    setLoading(false);

    window.location.href = mailtoLink;
  };

  return (
    <Stack
      direction="row"
      sx={{ p: 2 }}
      spacing={3}
      alignItems="center"
    >
      <Email />
      <Stack sx={{ justifyContent: "space-between", flexGrow: 1 }}>
        <Typography
          fontSize={14}
          lineHeight={"143%"}
          fontWeight={500}
          sx={{ opacity: 0.8 }}
        >
          Send via Email
        </Typography>
        <Typography
          fontSize={12}
          sx={{ opacity: 0.5 }}
        >
          {title
            .replace(/[\s,:]+/g, "-")
            .replace(/-+/g, "-")
            .trim()}
        </Typography>
      </Stack>
      <IconButton
        onClick={handleSendEmail}
        sx={{ border: "none", opacity: 0.6, justifyContent: "center", alignItems: "center" }}
      >
        {loading ? <CircularProgress size={16} /> : <ShareIcon />}
      </IconButton>
    </Stack>
  );
};

export default SendEmail;
