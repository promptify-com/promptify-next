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

const initialUser = { username: "loading", first_name: "loading", last_name: "loading", avatar: undefined, bio: "" };

function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [copyToClipboard, copiedResult] = useCopyToClipboard();

  const username = router.query.username as string;
  const PAGINATION_LIMIT = 12;

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

  const { data: user = initialUser } = useGetUserDetailsQuery(username, {
    skip: !username,
  });

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

  const userLink = `promptify.com/users/${user?.username}`;

  const handleClickCopy = async () => {
    await copyToClipboard(userLink);

    if (copiedResult?.state === "success") {
      dispatch(
        setToast({
          message: "The URL has been copied successfully.",
          severity: "success",
          duration: 1000,
        }),
      );
    }
  };

  const hasNoTemplates = Boolean(!templates?.results?.length && !templatesLoading);

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
        <Stack gap={"32px"}>
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
              fontSize={14}
              fontWeight={400}
              lineHeight={"22.4px"}
            >
              {user.bio}
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
        <Stack
          gap={2}
          // height={{ md: "calc(100svh - 320px)" }}
          minHeight={"480px"}
          width={"100%"}
          overflow={"hidden"}
          pr={{ xs: "16px", sm: 0 }}
          sx={{
            // overflowY: "auto",
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
            {`Prompts by ${user.first_name + " " + user.last_name}`}
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
                    maxWidth={{ xs: "99%", sm: "auto" }}
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
                          xl={3}
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
      </Stack>
      <FooterPrompt />
    </Layout>
  );
}

export default ProfilePage;
