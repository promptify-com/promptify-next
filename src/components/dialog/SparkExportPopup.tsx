import { Box, CircularProgress, Dialog, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Check, Email, FacebookRounded, GetAppRounded, Reddit, Twitter } from "@mui/icons-material";

import BaseButton from "../base/BaseButton";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import PdfIcon from "@/assets/icons/PdfIcon";
import WordIcon from "@/assets/icons/WordIcon";
import LinkVariantIcon from "@/assets/icons/LinkVariantIcon";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { getBaseUrl } from "@/common/helpers";
import { downloadBlobObject } from "@/common/helpers/handleExecutionExport";
import { executionsApi } from "@/core/api/executions";
import { useState } from "react";

interface SparkExportProps {
  onClose: () => void;
  activeExecution: TemplatesExecutions | null;
}

export const SparkExportPopup = ({ activeExecution, onClose }: SparkExportProps) => {
  const [exporting, setExporting] = useState({ pdf: false, word: false });

  if (!activeExecution) {
    throw new Error("Provided activeExecution is not a valid one!");
  }

  const sharedUrl = `${getBaseUrl}/prompt/${activeExecution.template?.slug}/?hash=${activeExecution.hash}`;

  const [exportExecution] = executionsApi.endpoints.exportExecution.useLazyQuery();
  const [copyToClipboard, copyResult] = useCopyToClipboard();

  const handleClickCopy = () => {
    copyToClipboard(sharedUrl);
  };

  const ENCODED_URL = encodeURIComponent(sharedUrl);

  const generateTitle = () => {
    if (activeExecution?.template?.title) {
      const hasNotitle = activeExecution.title.toLowerCase() === "untitled";
      return encodeURIComponent(hasNotitle ? activeExecution.template.title : activeExecution.title);
    } else {
      return encodeURIComponent(activeExecution.title);
    }
  };

  const handleExportExecution = async (fileType: "word" | "pdf") => {
    setExporting({ ...exporting, [fileType]: true });
    try {
      const response = await exportExecution({ id: activeExecution.id, fileType }).unwrap();
      downloadBlobObject(response, fileType, activeExecution.title);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setExporting({ ...exporting, [fileType]: false });
    }
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
                {activeExecution?.title}.pdf
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
                {activeExecution?.title}.docx
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
          display={"flex"}
          flexDirection={"column"}
          gap={"16px"}
        >
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
            share
          </Typography>

          <Grid
            p={"0px 16px 16px 16px"}
            display={"flex"}
            flexDirection={"column"}
            gap={"16px"}
          >
            <Typography
              fontSize={13}
              fontWeight={500}
              lineHeight={"13px"}
              p={0}
              display={"flex"}
              justifyContent={"center"}
              sx={{
                opacity: 0.8,
              }}
            >
              Anyone on the Internet with the link can view
            </Typography>
            <BaseButton
              onClick={handleClickCopy}
              variant="contained"
              color="custom"
              sx={{
                border: "none",
                color: "onSurface",
                width: "100%",
                height: "42px",
                bgcolor: "surface.3",
                "&:hover": {
                  bgcolor: "surface.5",
                },
              }}
            >
              {copyResult?.state === "success" ? <Check /> : <LinkVariantIcon />}
              <Typography ml={0.5}>
                {copyResult?.state === "success" ? "Copied successfully!" : " Copy Link"}
                {copyResult?.state === "error" && `Error: ${copyResult.message}`}
              </Typography>
            </BaseButton>

            <Grid
              display={"flex"}
              justifyContent={"space-around"}
            >
              <Box
                component={"a"}
                href={`https://www.facebook.com/sharer/sharer.php?u=${ENCODED_URL}`}
                target="_blank"
                sx={socialMediaStyle}
              >
                <FacebookRounded
                  sx={{
                    fontSize: "24px",
                  }}
                />
              </Box>
              <Box
                component={"a"}
                href={`https://twitter.com/intent/tweet?url=${ENCODED_URL}`}
                target="_blank"
                sx={socialMediaStyle}
              >
                <Twitter
                  sx={{
                    fontSize: "24px",
                  }}
                />
              </Box>
              <Box
                component={"a"}
                href={`https://www.reddit.com/submit?url=${ENCODED_URL}&title=${generateTitle()}`}
                target="_blank"
                sx={socialMediaStyle}
              >
                <Reddit
                  sx={{
                    fontSize: "24px",
                  }}
                />
              </Box>
              <Box
                component="a"
                href={`mailto:?subject=${generateTitle()}&body=${ENCODED_URL}`}
                sx={socialMediaStyle}
              >
                <Email
                  sx={{
                    fontSize: "24px",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

const socialMediaStyle = {
  display: "inline-block",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "none",
    color: "inherit",
    opacity: 0.8,
  },
};
