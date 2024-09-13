import { Box, CircularProgress, Dialog, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Email, GetAppRounded } from "@mui/icons-material";

import { TemplatesExecutions } from "@/core/api/dto/templates";
import PdfIcon from "@/assets/icons/PdfIcon";
import WordIcon from "@/assets/icons/WordIcon";
import { getBaseUrl } from "@/common/helpers";
import { downloadBlobObject } from "@/common/helpers/handleExecutionExport";
import { workflowsApi } from "@/core/api/workflows";
import { useState } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { format } from "date-fns";
import ShareIcon from "@/assets/icons/ShareIcon";
import { useExportWorkflowMutation } from "@/core/api/workflows";

interface ExportPopupChatProps {
  onClose: () => void;
  content: string;
}

export const ExportPopupChat = ({ onClose, content }: ExportPopupChatProps) => {
  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? undefined);
  const [exporting, setExporting] = useState({ pdf: false, word: false });

  const appTitle = clonedWorkflow?.name;
  const currentDate = format(new Date(), "MM-dd-yyyy");
  const title = `${appTitle} - ${currentDate}`;

  const [exportWorkflow] = useExportWorkflowMutation();

  const handleExportExecution = async (fileType: "word" | "pdf") => {
    if (!content) return;
    setExporting({ ...exporting, [fileType]: true });
    try {
      const response = await exportWorkflow({ content, fileType }).unwrap();
      downloadBlobObject(response, fileType, title.replace(/[\s,:]+/g, "-").trim());
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setExporting({ ...exporting, [fileType]: false });
    }
  };

  const handleSendEmail = () => {
    const subject = title ? title.replace(/-+/g, "-").trim() : "No title available for this AI App";

    const body = content ? encodeURIComponent(content) : encodeURIComponent("No text available for this AI App");

    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <Dialog
      open
      onClose={() => onClose()}
      disableScrollLock
    >
      <Grid width={{ md: "369px" }}>
        <Typography
          p={"16px"}
          sx={{
            fontSize: 12,
            color: "#375CA9",
            lineHeight: "180%",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          EXPORT
        </Typography>
        <Divider />
        <Grid
          p={"16px"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid
            display={"flex"}
            alignItems={"center"}
          >
            <Box
              p={"0px 8px"}
              mt={1}
            >
              <PdfIcon />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
            >
              <Typography
                fontSize={14}
                fontWeight={500}
                lineHeight={"157%"}
                letterSpacing={"0,46px"}
                sx={{
                  opacity: 0.8,
                }}
              >
                Export as PDF
              </Typography>
              <Typography
                fontSize={12}
                fontWeight={400}
                lineHeight={"143%"}
                letterSpacing={"0,17px"}
                sx={{
                  opacity: 0.5,
                }}
              >
                {title
                  .replace(/[\s,:]+/g, "-")
                  .replace(/-+/g, "-")
                  .trim()}
                .pdf
              </Typography>
            </Box>
          </Grid>
          <Box width={"60px"}>
            {exporting.pdf ? (
              <CircularProgress size={24} />
            ) : (
              <IconButton
                onClick={() => handleExportExecution("pdf")}
                sx={{ border: "none", opacity: 0.6 }}
              >
                <GetAppRounded />
              </IconButton>
            )}
          </Box>
        </Grid>
        <Divider />
        <Grid
          p={"16px"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid
            display={"flex"}
            alignItems={"center"}
          >
            <Box
              p={"0px 8px"}
              mt={1}
            >
              <WordIcon />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
            >
              <Typography
                fontSize={14}
                fontWeight={500}
                lineHeight={"157%"}
                letterSpacing={"0,46px"}
                sx={{
                  opacity: 0.8,
                }}
              >
                Export as Word Document
              </Typography>
              <Typography
                fontSize={12}
                fontWeight={400}
                lineHeight={"143%"}
                letterSpacing={"0,17px"}
                sx={{
                  opacity: 0.5,
                }}
              >
                {title
                  .replace(/[\s,:]+/g, "-")
                  .replace(/-+/g, "-")
                  .trim()}
                .docx
              </Typography>
            </Box>
          </Grid>

          <Box width={"60px"}>
            {exporting.word ? (
              <CircularProgress size={20} />
            ) : (
              <IconButton
                onClick={() => handleExportExecution("word")}
                sx={{ border: "none", opacity: 0.6 }}
              >
                <GetAppRounded />
              </IconButton>
            )}
          </Box>
        </Grid>

        <Divider />

        <Grid
          p={"16px"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid
            display={"flex"}
            alignItems={"center"}
          >
            <Box
              p={"0px 8px"}
              mt={1}
            >
              <Email />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
            >
              <Typography
                fontSize={14}
                fontWeight={500}
                lineHeight={"157%"}
                sx={{ opacity: 0.8 }}
              >
                Send via Email
              </Typography>
              <Typography
                fontSize={12}
                fontWeight={400}
                lineHeight={"143%"}
                sx={{ opacity: 0.5 }}
              >
                {title}
              </Typography>
            </Box>
          </Grid>
          <Box width={"60px"}>
            <IconButton
              onClick={handleSendEmail}
              sx={{ border: "none", opacity: 0.6 }}
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};
