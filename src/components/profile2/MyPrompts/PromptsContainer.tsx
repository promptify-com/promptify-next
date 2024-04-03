import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Add from "@mui/icons-material/Add";

import { ArrowDropDown } from "@mui/icons-material";
import { SortOption } from "../Types";
import TemplateCardPlaceholder from "@/components/placeholders/TemplateCardPlaceholder";

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
        width: "85%",
        m: { xs: "10px 0 0 0", md: "auto" },
        p: "40px 20px",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        p={"8px 16px"}
      >
        <Typography
          fontSize={32}
          fontWeight={400}
          color={"onSurface"}
        >
          {title}
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
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
          >
            New prompt
          </Button>
        </Stack>
      </Stack>

      {isFetching ? <TemplateCardPlaceholder /> : children}
    </Stack>
  );
}
