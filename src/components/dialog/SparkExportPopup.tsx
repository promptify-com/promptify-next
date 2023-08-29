import { Check, DeleteRounded, GetAppRounded } from "@mui/icons-material";
import { Box, Dialog, DialogTitle, Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import BaseButton from "../base/BaseButton";
import { Execution, ExecutionTemplatePopupType } from "@/core/api/dto/templates";
import { executionsApi, useDeleteExecutionMutation, useUpdateExecutionMutation } from "@/core/api/executions";
import PdfIcon from "@/assets/icons/PdfIcon";
import WordIcon from "@/assets/icons/WordIcon";
import LinkVariantIcon from "@/assets/icons/LinkVariantIcon";

export type FileType = "pdf" | "word";

interface SparkExportProps {
  open: boolean;
  onClose: () => void;
  activeExecution: Execution | null;
}

export const SparkExportPopup = ({ open, activeExecution, onClose }: SparkExportProps) => {
  const [exportExecution, { isFetching }] = executionsApi.endpoints.exportExecution.useLazyQuery();

  const handleExport2Pdf = () => {
    if (activeExecution) {
      exportExecution({ id: activeExecution.id, fileType: "pdf" });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Grid width={"369px"}>
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
            onClick={() => handleExport2Pdf()}
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
                {activeExecution?.title}.docs
              </Typography>
            </Box>
          </Grid>
          <IconButton
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
          <Divider />
          <Grid p={"16px"}>
            <BaseButton
              variant="contained"
              color="custom"
              sx={{
                border: "none",
                color: "onSurface",
                width: "100%",
                height: "42px",
                bgcolor: "surface.3",
              }}
            >
              <LinkVariantIcon />
              <Typography ml={0.5}> Copy Link</Typography>
            </BaseButton>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};
