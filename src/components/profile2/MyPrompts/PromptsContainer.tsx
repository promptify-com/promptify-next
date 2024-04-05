import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Add from "@mui/icons-material/Add";
import TemplateCardPlaceholder from "@/components/placeholders/TemplateCardPlaceholder";

import { ArrowDropDown } from "@mui/icons-material";
import type { SortOption } from "@/components/profile2/Types";

interface PromptsContainerProps {
  children?: React.ReactNode;
  title: string;
  sortOption: SortOption;
  setSortAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  sortOpen: boolean;
  isFetching: boolean;
}

export default function PromptsContainer({
  children,
  title,
  sortOption,
  setSortAnchor,
  sortOpen,
  isFetching,
}: PromptsContainerProps) {
  return (
    <Stack
      gap={5}
      sx={{
        maxWidth: "1184px",
        width: { xs: "100%", md: "85%" },
        m: "auto",
        p: "40px 16px",
        ["@media (max-width: 425)"]: {
          p: "0px 0",
        },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent={"space-between"}
        gap={1}
        p={{ xs: 0, md: "8px 16px" }}
      >
        <Typography
          fontSize={{ xs: 24, md: 32 }}
          fontWeight={400}
          color={"onSurface"}
          sx={{
            flexGrow: 1,
            display: "block",
            textAlign: "left",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "center" },
            alignItems: "center",
            width: { xs: "60%", md: "auto" },
            mx: "auto",
            gap: 1,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Button
            onClick={e => setSortAnchor(e.currentTarget)}
            endIcon={<ArrowDropDown />}
            sx={{
              border: "1px solid",
              borderColor: "surfaceContainerHigh",
              p: "8px 16px",
              fontSize: 14,
              fontWeight: 500,
              color: "onSurface",
              gap: 0.5,
              width: { xs: "100%", md: "auto" },
              label: { color: "secondary.light", cursor: "pointer" },
              svg: {
                transform: sortOpen ? "rotateX(180deg)" : "none",
              },
              ":hover": {
                bgcolor: "surfaceContainerHigh",
              },
            }}
          >
            <Box component={"label"}>Sort by:</Box>
            {sortOption.label}
          </Button>
          <Button
            LinkComponent={Link}
            href="/prompt-builder/create"
            variant="contained"
            endIcon={<Add />}
            sx={{
              width: { xs: "100%", md: "auto" },
            }}
          >
            New prompt
          </Button>
        </Box>
      </Stack>

      {isFetching ? <TemplateCardPlaceholder /> : children}
    </Stack>
  );
}
