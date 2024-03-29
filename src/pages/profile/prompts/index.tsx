import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TemplateCard from "@/components/common/TemplateCard";
import { useGetMyTemplatesQuery } from "@/core/api/templates";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Link from "next/link";
import type { Templates } from "@/core/api/dto/templates";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { SortOption } from "@/components/profile2/Types";
import { SORTING_OPTIONS } from "@/components/profile2/Constants";

function ProfilePrompts() {
  const [sortOption, setSortOption] = useState(SORTING_OPTIONS[0]);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const { data: fetchedTemplates } = useGetMyTemplatesQuery({
    ordering: sortOption.orderby,
  });

  const handleSelectSort = (option: SortOption) => {
    setSortOption(option);
    setSortAnchor(null);
  };

  const templates = fetchedTemplates as Templates[];
  const sortOpen = Boolean(sortAnchor);

  return (
    <Protected>
      <Layout>
        <Stack
          gap={5}
          sx={{
            maxWidth: "1184px",
            width: "85%",
            m: "auto",
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
              My prompts:
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
          <Stack
            alignItems={"flex-start"}
            gap={2}
            px={"16px"}
          >
            {templates?.map(template => (
              <Box
                key={template.id}
                sx={{
                  width: "100%",
                  border: "1px solid",
                  borderColor: "surfaceContainerHighest",
                  borderRadius: "16px",
                }}
              >
                <TemplateCard
                  template={template}
                  manageActions
                />
              </Box>
            ))}
          </Stack>
        </Stack>

        <Menu
          anchorEl={sortAnchor}
          open={sortOpen}
          onClose={() => setSortAnchor(null)}
          disableScrollLock
          sx={{
            ".MuiList-root": {
              p: 0,
            },
            ".MuiMenuItem-root": {
              borderTop: "1px solid #E3E3E3",
              fontSize: 14,
              fontWeight: 400,
              color: "onSurface",
            },
          }}
        >
          {SORTING_OPTIONS.map(option => (
            <MenuItem
              key={option.label}
              onClick={() => handleSelectSort(option)}
              disabled={sortOption.orderby === option.orderby}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "My Prompts",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfilePrompts;
