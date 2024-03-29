import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { Layout } from "@/layout";
import { useGetUserDetailsQuery, useGetUserTemplatesQuery } from "@/core/api/user";
import Image from "@/components/design-system/Image";
import CardTemplate from "@/components/common/cards/CardTemplate";
import LatestTemplatePlaceholder from "@/components/placeholders/LatestTemplatePlaceholder";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import FooterPrompt from "@/components/explorer/FooterPrompt";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import type { Templates } from "@/core/api/dto/templates";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import useTruncate from "@/hooks/useTruncate";
import type { UserProfile } from "@/core/api/dto/user";

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

function UserInformation({ username, user }: { username: string | undefined; user: UserProfile }) {
  const { truncate } = useTruncate();
  const dispatch = useAppDispatch();
  const [truncateBio, setTruncateBio] = useState(true);
  const [copyToClipboard, copiedResult] = useCopyToClipboard();
  const userLink = `promptify.com/users/${user?.username}`;
  const handleClickCopy = async () => {
    await copyToClipboard(userLink);
  };

  useEffect(() => {
    if (copiedResult?.state === "success") {
      dispatch(
        setToast({
          message: "The URL has been copied successfully.",
          severity: "success",
          duration: 1000,
        }),
      );
    }
  }, [copiedResult]);

  if (!username) {
    return null;
  }

  return (
    <Stack
      gap={"32px"}
      width={{ sx: "100%", md: "320px" }}
    >
      <Box
        position={"relative"}
        width={"152px"}
        height={"152px"}
        borderRadius={"999px"}
        overflow={"hidden"}
      >
        <Image
          src={user.avatar}
          alt={user.username}
          fallback={require("@/assets/images/default-avatar.jpg")}
          fill
        />
      </Box>
      <Stack>
        <Typography
          fontSize={24}
          lineHeight={"28.8px"}
        >
          {user.first_name + " " + user.last_name}
        </Typography>
        <Typography
          component={"div"}
          fontSize={14}
          fontWeight={400}
          lineHeight={"22.4px"}
        >
          {truncateBio ? (
            <>
              {truncate(user.bio, { length: 190 })}
              {user.bio?.length > 190 && (
                <Typography
                  component={"span"}
                  sx={{
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onClick={() => setTruncateBio(!truncateBio)}
                >
                  Read more
                </Typography>
              )}
            </>
          ) : (
            user.bio
          )}
        </Typography>
        <Typography
          mt={"16px"}
          fontSize={12}
          fontWeight={500}
          lineHeight={"16.8px"}
          letterSpacing={"0.17px"}
          color={"primary.main"}
          onClick={handleClickCopy}
          sx={{ cursor: "pointer" }}
        >
          {userLink}
        </Typography>
      </Stack>
    </Stack>
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
              >
                <>
                  {allTemplates?.map(template => (
                    <Grid
                      key={template.id}
                      item
                      sm={4}
                      md={4}
                      lg={3}
                      xl={2}
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
