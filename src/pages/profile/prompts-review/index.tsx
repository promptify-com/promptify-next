import { useEffect, useState } from "react";

import Protected from "@/components/Protected";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TemplateCard from "@/components/common/TemplateCard";
import ArrowRight from "@mui/icons-material/ArrowRight";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import PromptsSort from "@/components/profile2/MyPrompts/PromptsSort";
import PromptsContainer from "@/components/profile2/MyPrompts/PromptsContainer";

import { Layout } from "@/layout";
import { SEO_DESCRIPTION } from "@/common/constants";
import { SORTING_OPTIONS } from "@/components/profile2/Constants";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { SortOption } from "@/components/profile2/Types";
import { useAppSelector } from "@/hooks/useStore";
import { redirectToPath } from "@/common/helpers";

function ProfilePromptsReview() {
  const [sortOption, setSortOption] = useState(SORTING_OPTIONS[0]);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const currentUser = useAppSelector(state => state.user.currentUser);

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
    shouldSkip: false,
  });
  const handleSelectSort = (option: SortOption) => {
    setSortOption(option);
    setSortAnchor(null);
  };

  useEffect(() => {
    if (!currentUser?.is_admin) {
      redirectToPath("/");
    }
  }, []);

  const sortOpen = Boolean(sortAnchor);

  return (
    <Protected>
      <Layout>
        <PromptsContainer
          title="Prompts Review"
          sortOption={sortOption}
          setSortAnchor={setSortAnchor}
          sortOpen={sortOpen}
          isFetching={isFetching}
        >
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
              {fetchedTemplates?.map(template => (
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
                    displayCreatorAvatar
                  />
                </Box>
              ))}
            </Stack>
          </TemplatesPaginatedList>
        </PromptsContainer>

        <PromptsSort
          sortAnchor={sortAnchor}
          sortOpen={sortOpen}
          setSortAnchor={setSortAnchor}
          handleSelectSort={handleSelectSort}
          sortOption={sortOption}
        />
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
