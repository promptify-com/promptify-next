import { useState } from "react";
import Protected from "@/components/Protected";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TemplateCard from "@/components/common/TemplateCard";
import PromptsSort from "@/components/profile2/MyPrompts/PromptsSort";
import PromptsContainer from "@/components/profile2/MyPrompts/PromptsContainer";

import { Layout } from "@/layout";
import { SEO_DESCRIPTION } from "@/common/constants";
import { useGetMyTemplatesQuery } from "@/core/api/templates";
import { SortOption } from "@/components/profile2/Types";
import { SORTING_OPTIONS } from "@/components/profile2/Constants";
import type { Templates } from "@/core/api/dto/templates";
import UserLayout from "@/components/profile2/UserLayout";

function ProfilePrompts() {
  const [sortOption, setSortOption] = useState(SORTING_OPTIONS[0]);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const { data: fetchedTemplates, isFetching } = useGetMyTemplatesQuery({
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
        <UserLayout title={"My prompts"}>
          <PromptsContainer
            title="My prompts:"
            sortOption={sortOption}
            setSortAnchor={setSortAnchor}
            sortOpen={sortOpen}
            isFetching={isFetching}
          >
            <Stack
              alignItems={"flex-start"}
              gap={2}
              px={{ xs: 0, md: "16px" }}
            >
              {templates?.map(template => (
                <Box
                  key={template.id}
                  sx={{
                    width: { xs: "92%", md: "100%" },
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
          </PromptsContainer>

          <PromptsSort
            sortAnchor={sortAnchor}
            sortOpen={sortOpen}
            setSortAnchor={setSortAnchor}
            handleSelectSort={handleSelectSort}
            sortOption={sortOption}
          />
        </UserLayout>
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
