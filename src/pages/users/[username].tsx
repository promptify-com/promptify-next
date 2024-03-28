import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { Layout } from "@/layout";
import { useGetUserDetailsQuery, useGetUserTemplatesQuery } from "@/core/api/user";
import CardTemplate from "@/components/common/cards/CardTemplate";
import LatestTemplatePlaceholder from "@/components/placeholders/LatestTemplatePlaceholder";
import FooterPrompt from "@/components/explorer/FooterPrompt";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import UserInformation from "@/components/profile/UserInformation";
import type { Templates } from "@/core/api/dto/templates";

const initialUser = { username: "loading", first_name: "loading", last_name: "loading", avatar: "", bio: "", id: 0 };
const PAGINATION_LIMIT = 12;

function ProfilePage() {
  const router = useRouter();
  const username = router.query.username as string;
  const { data: user = initialUser } = useGetUserDetailsQuery(username, {
    skip: !username,
  });

  return (
    <Layout>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={"start"}
        pt={{ xs: " 80px", md: "48px" }}
        px={"8px"}
        width={{ xs: "100%", md: "94%" }}
        gap={"50px"}
        mx={"auto"}
      >
        <UserInformation
          username={username}
          user={user}
        />
        <PromptsList
          username={username}
          firstName={user.first_name}
          lastName={user.last_name}
        />
      </Stack>
      <FooterPrompt />
    </Layout>
  );
}

function PromptsList({ username, firstName, lastName }: { username: string; firstName: string; lastName: string }) {
  const [offset, setOffset] = useState(0);
  const [allTemplates, setAllTemplates] = useState<Templates[]>([]);
  const {
    data: templates,
    isLoading: templatesLoading,
    isFetching,
  } = useGetUserTemplatesQuery(
    {
      username,
      offset,
      limit: PAGINATION_LIMIT,
    },
    {
      skip: !username,
    },
  );

  useEffect(() => {
    if (templates?.results) {
      if (offset === 0) {
        setAllTemplates(templates?.results);
      } else {
        setAllTemplates(prevTemplates => prevTemplates.concat(templates?.results));
      }
    }
  }, [templates?.results]);

  const handleNextPage = () => {
    if (!!templates?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };
  const hasNoTemplates = Boolean(!templates?.results?.length && !templatesLoading);

  if (!username) {
    return null;
  }

  return (
    <Stack
      gap={2}
      minHeight={"480px"}
      width={"100%"}
      overflow={"hidden"}
      pr={{ xs: "16px", sm: 0 }}
      sx={{
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          width: "0px",
        },
      }}
    >
      <Typography
        fontSize={24}
        fontWeight={400}
        lineHeight={"28.8px"}
        letterSpacing={"0.17px"}
        pl={{ md: "15px" }}
      >
        {`Prompts by ${firstName + " " + lastName}`}
      </Typography>
      {hasNoTemplates ? (
        <Stack
          minHeight={"60svh"}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography color={"text.secondary"}>No templates created</Typography>
        </Stack>
      ) : (
        <>
          {templatesLoading ? (
            <Grid
              container
              gap={2}
              justifyContent={"center"}
            >
              <LatestTemplatePlaceholder count={10} />
            </Grid>
          ) : (
            <TemplatesPaginatedList
              loading={isFetching}
              hasNext={!!templates?.next}
              onNextPage={handleNextPage}
              hasPrev={false}
              buttonText={isFetching ? "Loading..." : "Load more"}
              variant="outlined"
              endIcon={
                isFetching && (
                  <CircularProgress
                    size={24}
                    color="primary"
                  />
                )
              }
            >
              <Grid
                container
                gap={{ xs: 1, sm: 0 }}
                spacing={1}
                maxWidth={{ xs: "98%", sm: "auto" }}
              >
                <>
                  {allTemplates?.map(template => (
                    <Grid
                      key={template.id}
                      item
                      xs={12}
                      sm={6}
                      md={5}
                      lg={3}
                    >
                      <CardTemplate
                        template={template}
                        vertical
                      />
                    </Grid>
                  ))}
                </>
              </Grid>
            </TemplatesPaginatedList>
          )}
        </>
      )}
    </Stack>
  );
}

export default ProfilePage;
