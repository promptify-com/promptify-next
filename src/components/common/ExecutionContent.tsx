import Box from "@mui/material/Box";

export const ExecutionContent = ({ content }: { content: string }) => (
  <Box
    sx={{
      width: "100%",
      fontSize: { xs: 14, md: 15 },
      lineHeight: "170%",
      fontWeight: 400,
      color: "onSurface",
      wordWrap: "break-word",
      textAlign: "justify",
      float: "none",
      ".highlight": {
        backgroundColor: "yellow",
        color: "black",
      },
      code: {
        bgcolor: "#282a35",
        color: "common.white",
        borderRadius: "4px",
        p: "4px 6px",
        mb: "10px",
        overflow: "auto",
        fontSize: { xs: 12, md: 13 },
        whiteSpace: "nowrap",
      },
      pre: {
        m: "10px 0",
        borderRadius: "8px",
        overflow: "hidden",
        code: {
          display: "block",
          p: "16px 24px",
          borderRadius: 0,
          m: 0,
        },
      },
      ".language-label": {
        p: "8px 24px",
        bgcolor: "#4d5562",
        color: "#ffffff",
        fontSize: 13,
      },
    }}
    dangerouslySetInnerHTML={{
      __html: content,
    }}
  />
);
