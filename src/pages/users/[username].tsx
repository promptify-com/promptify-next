import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Layout } from "@/layout";
import { useGetUserTemplatesQuery } from "@/core/api/user";
import useBrowser from "@/hooks/useBrowser";
import { authClient } from "@/common/axios";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import { UserProfile } from "@/core/api/dto/user";
import CardTemplate from "@/components/common/cards/CardTemplate";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import PaginatedList from "@/components/PaginatedList";
import UserInformation from "@/components/profile/UserInformation";
import Footer from "@/components/Footer";
import type { ICardTemplate, Templates } from "@/core/api/dto/templates";

const initialUser = { username: "loading", first_name: "loading", last_name: "loading", avatar: "", bio: "", id: 0 };
const PAGINATION_LIMIT = 12;

function ProfilePage({ user = initialUser }: { user: UserProfile }) {
  const router = useRouter();
  const { isMobile } = useBrowser();
  const username = router.query.username as string;

  return (
    <Layout>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={"start"}
        pt={{ xs: " 80px", md: "48px" }}
        width={{ xs: "100%", md: "94%" }}
        gap={"50px"}
        mx={{ md: "auto" }}
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
      {!isMobile && <Footer />}
    </Layout>
  );
}

function PromptsList({ username, firstName, lastName }: { username: string; firstName: string; lastName: string }) {
  const [offset, setOffset] = useState(0);
  const [allTemplates, setAllTemplates] = useState<Templates[]>([]);
  const [preparedTemplates, setPreparedTemplates] = useState<ICardTemplate[]>([]);

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
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates?.results]);

  useEffect(() => {
    if (allTemplates) {
      const tempTemplates = allTemplates.map(template => ({
        image: template.thumbnail,
        title: template.title,
        href: `/prompt/${template.slug}`,
        executionsCount: template.executions_count,
        tags: template.tags,
        description: template.description,
        slug: template.slug,
        likes: template.likes ?? 0,
        created_by: template.created_by,
        type: "template",
      }));
      setPreparedTemplates(tempTemplates);
    }
  }, [allTemplates]);

  const handleNextPage = () => {
    if (templates?.next) {
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
      width={{ xs: "auto", sm: "100%", md: "100%" }}
      overflow={"hidden"}
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
        px={"16px"}
      >
        {`Prompts by ${firstName + " " + lastName}`}
      </Typography>
      {hasNoTemplates ? (
        <Stack
          minHeight={{ xs: "30svh", md: "60svh" }}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            ml: { xs: "6em", sm: 0 },
            [`@media (max-width: 430)`]: {
              ml: "3em",
            },
          }}
        >
          <Typography color={"text.secondary"}>No templates created</Typography>
        </Stack>
      ) : (
        <>
          {templatesLoading ? (
            <CardTemplatePlaceholder count={10} />
          ) : (
            <PaginatedList
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
                spacing={1}
                px={{ xs: "16px", md: 0 }}
              >
                {preparedTemplates?.map((template, index) => (
                  <Grid
                    key={index}
                    item
                    xs={6}
                    sm={6}
                    md={5}
                    lg={3}
                  >
                    <CardTemplate template={template} />
                  </Grid>
                ))}
              </Grid>
            </PaginatedList>
          )}
        </>
      )}
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const username = context.params?.username as string;
  try {
    const userRes = await authClient.get(`/api/meta/users/${username}/`);
    const user: UserProfile | null = userRes.data;

    if (!user?.is_public) {
      return {
        redirect: {
          destination: `/users/private/${username}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        title: `${username} | ${SEO_TITLE}`,
        description: SEO_DESCRIPTION,
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        title: `${username} | ${SEO_TITLE}`,
        description: SEO_DESCRIPTION,
        user: initialUser,
      },
    };
  }
};
export default ProfilePage;
