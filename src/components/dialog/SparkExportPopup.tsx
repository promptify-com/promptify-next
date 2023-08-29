import { Box, Dialog, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Check, Email, FacebookRounded, GetAppRounded, Reddit, Twitter } from "@mui/icons-material";

import BaseButton from "../base/BaseButton";
import { ExecutionWithTemplate } from "@/core/api/dto/templates";
import PdfIcon from "@/assets/icons/PdfIcon";
import WordIcon from "@/assets/icons/WordIcon";
import LinkVariantIcon from "@/assets/icons/LinkVariantIcon";
import { exportExecution } from "@/hooks/api/executions";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { GetBaseURL } from "@/common/helpers/getBaseUrl";

interface SparkExportProps {
  open: boolean;
  onClose: () => void;
  activeExecution: ExecutionWithTemplate | null;
}

export const SparkExportPopup = ({ open, activeExecution, onClose }: SparkExportProps) => {
  const sharedUrl = `${GetBaseURL()}/prompt/${activeExecution?.title}/?=spark=${activeExecution?.id}`;
  const [copyToClipboard, copyResult] = useCopyToClipboard();

  const handleExport = async (fileType: "word" | "pdf") => {
    const isPdf = fileType === "pdf";
    if (activeExecution) {
      try {
        const fileData = await exportExecution(activeExecution.id, fileType);

        const blob = new Blob([fileData], { type: isPdf ? "application/pdf" : "application/msword" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeExecution.title}.${isPdf ? "pdf" : "docx"}`;
        a.click();

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error exporting and downloading:", error);
      }
    }
  };

  const handleClickCopy = () => {
    copyToClipboard(sharedUrl);
  };

  const ENCODED_URL = encodeURIComponent(sharedUrl);

  const generateTitle = () => {
    if (activeExecution?.template) {
      const hasNotitle = activeExecution?.title.toLowerCase() === "untitled";
      return encodeURIComponent(hasNotitle ? activeExecution.template.title : activeExecution.title);
    } else return activeExecution?.title;
  };

  const handleFacebookShare = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${ENCODED_URL}`;
    window.open(facebookShareUrl, "_blank");
  };
  const handleTwitterShare = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${ENCODED_URL}`;
    window.open(twitterShareUrl, "_blank");
  };
  const handleRedditShare = () => {
    const redditTitle = generateTitle();
    const redditShareUrl = `https://www.reddit.com/submit?url=${ENCODED_URL}&title=${redditTitle}`;
    window.open(redditShareUrl, "_blank");
  };
  const handleEmailShare = () => {
    const subject = generateTitle();
    const body = ENCODED_URL;

    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
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

          <IconButton
            onClick={() => handleExport("pdf")}
            sx={{
              border: "none",
              opacity: 0.6,
            }}
          >
            <GetAppRounded />
          </IconButton>
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
                Export as Word Dodcument
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

          <IconButton
            onClick={() => handleExport("word")}
            sx={{
              border: "none",
              opacity: 0.6,
            }}
          >
            <GetAppRounded />
          </IconButton>
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
            <BaseButton
              onClick={() => handleClickCopy()}
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
              <Box onClick={() => handleFacebookShare()}>
                <FacebookRounded
                  sx={{
                    fontSize: "24px",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                />
              </Box>
              <Box onClick={() => handleTwitterShare()}>
                <Twitter
                  sx={{
                    fontSize: "24px",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                />
              </Box>
              <Box onClick={() => handleRedditShare()}>
                <Reddit
                  sx={{
                    fontSize: "24px",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                />
              </Box>
              <Box onClick={() => handleEmailShare()}>
                <Email
                  sx={{
                    fontSize: "24px",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
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
