import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";

import useSetUser from "@/hooks/useSetUser";
import useToken from "@/hooks/useToken";
import {
  Category,
  FilterParams,
  SelectedFilters,
  Tag,
} from "@/core/api/dto/templates";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { getPathURL, saveToken } from "@/common/utils";
import { authClient, client } from "@/common/axios";
import {
  useGetTagsPopularQuery,
  useGetTemplatesSuggestedQuery,
  useGetLastTemplatesQuery,
} from "@/core/api/explorer";
import { RootState } from "@/core/store";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { ExploreHeaderImage } from "@/assets/icons/exploreHeader";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { FetchLoading } from "@/components/FetchLoading";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useSetUser();
  const savedToken = useToken();
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesSuggestedQuery();
  const { data: lastTemplate, isLoading: islastTemplateLoading } =
    useGetLastTemplatesQuery();

  const preLogin = () => {
    setIsLoading(true);
  };

  const postLogin = (response: IContinueWithSocialMediaResponse | null) => {
    if (!response) return;
    if (response?.created) {
      setUser(response);
      router.push("/signup");
    } else {
      const path = getPathURL();
      if (path) {
        router.push(path);
      }
    }
    setIsLoading(false);
  };

  const doPostLogin = (r: AxiosResponse<IContinueWithSocialMediaResponse>) => {
    const { token } = r.data;
    if (!!savedToken && token !== savedToken) {
      const path = getPathURL();
      if (path) {
        router.push(path);
        localStorage.setItem("from", "alert");
      }
    } else {
      setUser(r.data);
      saveToken(r.data);
      postLogin(r.data);
    }
  };
  const { data: user, isLoading: userLoading } =
    useGetCurrentUserQuery(savedToken);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");
    preLogin();

    if (!!authorizationCode && !savedToken) {
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then(doPostLogin)
        .catch(() => postLogin(null));
    } else if (authorizationCode && !!savedToken) {
      authClient
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then(doPostLogin)
        .catch(() => postLogin(null));
    }
  }, []);
  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  return (
    <>
      <Box width={"100%"}>
        <Layout>
          {userLoading ? (
            <FetchLoading />
          ) : user && savedToken ? (
            <Box
              mt={{ xs: 7, md: 0 }}
              padding={{ xs: "4px 0px", md: "0px 8px" }}
            >
              <Grid
                display={"flex"}
                flexDirection={"column"}
                sx={{
                  padding: { xs: "16px", md: "32px" },
                  paddingBottom: "0 !important",
                }}
              >
                <Grid flexDirection="column" display={"flex"} mb={"22px"}>
                  <Grid
                    sx={{
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 500,
                        fontSize: { xs: "30px", sm: "48px" },
                        lineHeight: { xs: "30px", md: "56px" },
                        color: "#1D2028",
                        marginLeft: { xs: "0px", sm: "0px" },
                      }}
                    >
                      Welcome, {user?.username}
                    </Typography>
                  </Grid>
                </Grid>

                {lastTemplate && Object.keys(lastTemplate).length > 0 && (
                  <TemplatesSection
                    isLoading={islastTemplateLoading}
                    templates={[lastTemplate]}
                  >
                    Your Latest Template:
                  </TemplatesSection>
                )}
              </Grid>
              <Grid
                display={"flex"}
                flexDirection={"column"}
                sx={{
                  padding: { xs: "16px", md: "32px" },
                  paddingBottom: "0 !important",
                }}
              >
                <TemplatesSection
                  isLoading={isTemplatesLoading}
                  templates={templates}
                >
                  You may like this templates:
                </TemplatesSection>
              </Grid>
              <Grid
                display={"flex"}
                flexDirection={"column"}
                sx={{
                  padding: { xs: "16px", md: "32px" },
                }}
              >
                <CategoriesSection
                  categories={categories}
                  isLoading={isCategoryLoading}
                />
              </Grid>
            </Box>
          ) : (
            <>
              <Box
                mt={{ xs: 7, md: 0 }}
                padding={{ xs: "4px 0px", md: "0px 8px" }}
              >
                <Box
                  sx={{
                    padding: { xs: "16px", md: "32px" },
                  }}
                >
                  <Stack
                    bgcolor={"white"}
                    sx={{
                      padding: { xs: "16px", md: "24px" },
                      borderRadius: "25px",
                      gap: { xs: "25px", sm: "48px", md: "10px", lg: "48px" },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Stack
                      sx={{
                        paddingBlock: "8px",
                        paddingInline: {
                          xs: "40px",
                          sm: "8px",
                          md: "8px",
                          lg: "40px",
                        },
                        alignItems: "center",
                      }}
                    >
                      <ExploreHeaderImage />
                    </Stack>

                    <Stack
                      flex={1}
                      justifyContent="center"
                      sx={{ alignItems: { xs: "center", sm: "flex-start" } }}
                    >
                      <Typography
                        sx={{
                          fontStyle: "normal",
                          fontWeight: 500,
                          fontSize: "24px",
                          lineHeight: "28px",
                          letterSpacing: "0.15px",
                          color: "#1D2028",
                          marginBottom: "8px",
                        }}
                      >
                        Welcome to Promptify
                      </Typography>
                      <Typography
                        sx={{
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "23px",
                          letterSpacing: "0.4px",
                          color: "#1D2028",
                          marginBottom: "16px",
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        Unleash your creative potential using Promptify, the
                        ultimate ChatGPT and AI-driven content generation and
                        idea inspiration platform. Try it today!
                      </Typography>

                      <Stack direction={"row"} gap={"8px"}>
                        <Button
                          onClick={() =>
                            router.push({
                              pathname: "/signin",
                              query: { from: "signup" },
                            })
                          }
                          sx={{
                            display: "flex",
                            padding: "6px 16px",
                            justifyContent: "center",
                            alignItems: "center",

                            borderRadius: "100px",
                            background: "#3B4050",
                            color: "#FFF",

                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "24px",
                            letterSpacing: "0.4px",
                            "&:hover": {
                              color: "#000000",
                              outline: "1px solid #3B4050",
                            },
                          }}
                        >
                          Sign Up for Free
                        </Button>
                        <Button
                          onClick={() =>
                            router.push({
                              pathname: "https://promptify.com",
                            })
                          }
                          sx={{
                            display: "flex",
                            padding: "6px 16px",
                            justifyContent: "center",
                            alignItems: "center",

                            borderRadius: "100px",
                            background: "transparent",
                            color: "var(--primary-main, #3B4050)",
                            border:
                              "1px solid var(--primary-states-outlined-border, rgba(59, 64, 80, 0.15))",

                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "24px",
                            letterSpacing: "0.4px",

                            "&:hover": {
                              color: "#FFF",
                              background:
                                "var(--primary-states-outlined-border, rgba(59, 64, 80, 0.15))",
                            },
                          }}
                        >
                          How it Works?
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Box>

              <Box padding={{ xs: "4px 0px", md: "0px 8px" }}>
                <Grid
                  display={"flex"}
                  flexDirection={"column"}
                  gap={"16px"}
                  sx={{
                    padding: { xs: "16px", md: "32px" },
                  }}
                >
                  <CategoriesSection
                    categories={categories}
                    isLoading={isCategoryLoading}
                  />
                </Grid>
              </Box>
            </>
          )}
        </Layout>
      </Box>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default Home;
