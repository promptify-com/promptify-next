import { Layout } from "@/layout";

import Protected from "@/components/Protected";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TemplateCard from "@/components/common/TemplateCard";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import ArrowRight from "@mui/icons-material/ArrowRight";

import { SEO_DESCRIPTION } from "@/common/constants";
import type { Templates } from "@/core/api/dto/templates";
import { useState } from "react";
import { SortOption } from "@/components/profile2/Types";
import { SORTING_OPTIONS } from "@/components/profile2/Constants";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import TemplateCardPlaceholder from "@/components/placeholders/TemplateCardPlaceholder";

function ProfilePromptsReview() {
  const [sortOption, setSortOption] = useState(SORTING_OPTIONS[0]);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const {
    templates: fetchedTemplates,
    handleNextPage,
    hasMore,
    isFetching,
    hasPrev,
    handlePrevPage,
  } = useGetTemplatesByFilter({
    ordering: sortOption.orderby,
    paginatedList: true,
    admin: true,
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
              Prompts Review
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

          {isFetching ? (
            <TemplateCardPlaceholder />
          ) : (
            <TemplatesPaginatedList
              loading={isFetching}
              hasNext={!!hasMore}
              onNextPage={handleNextPage}
              hasPrev={hasPrev}
              onPrevPage={handlePrevPage}
              endIcon={<ArrowRight />}
            >
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
                      displayAvatar
                    />
                  </Box>
                ))}
              </Stack>
            </TemplatesPaginatedList>
          )}
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
      title: "Prompts review",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfilePromptsReview;
