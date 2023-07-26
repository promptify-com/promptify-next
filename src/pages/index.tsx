import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";

import useSetUser from "@/hooks/useSetUser";
import useToken from "@/hooks/useToken";
import { TopicImg } from "@/assets/icons/TopicImg";
import { Category, Tag } from "@/core/api/dto/templates";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { getPathURL, saveToken } from "@/common/utils";
import { authClient, client } from "@/common/axios";
import {
  useGetTagsPopularQuery,
  useGetTemplatesByFilterQuery,
} from "@/core/api/explorer";
import { RootState } from "@/core/store";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useGetCategoriesQuery } from "@/core/api/categories";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function Home() {
  const router = useRouter();
  const setUser = useSetUser();
  const savedToken = useToken();
  const dispatch = useDispatch();
  const tagsData = useSelector((state: RootState) => state.filters.tag);

  const filteredTags = tagsData
    .filter((item: Tag | null) => item !== null)
    .map((item: Tag | null) => item?.name)
    .join("&tag=");

  const { data: categories } = useGetCategoriesQuery();
  const { data: tags } = useGetTagsPopularQuery();
  const { data: templates, isLoading: isTemplateLoading } =
    useGetTemplatesByFilterQuery({ tag: filteredTags });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categorySelected, setCategorySelected] = useState<number>();

  const handleTagSelect = (tag: Tag | null) => {
    dispatch(setSelectedTag(tag));
  };

  const handleClickCategory = (el: number, category: Category) => {
    router.push({
      pathname: `/explore/${category.slug}`,
    });
    setCategorySelected(el);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      dispatch(setSelectedTag(null));
    });
  }, [router.events]);

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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");
    preLogin();
    if (authorizationCode && !savedToken) {
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
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Box width={"100%"}>
        <Layout>
          <Box padding={{ xs: "4px 0px", md: "0px 8px" }}>
            <Grid
              sx={{
                padding: { xs: "16px", md: "32px" },
              }}
            >
              <Grid
                flexDirection="column"
                display={"flex"}
                sx={{
                  padding: "1em",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontSize: { xs: "30px", sm: "48px" },
                      lineHeight: { xs: "30px", md: "72px" },
                      color: "#1D2028",
                      marginLeft: { xs: "0px", sm: "0px" },
                    }}
                  >
                    Welcome to Promptify
                  </Typography>
                </Grid>
                <Grid
                  mt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      width: { xs: "100%", sm: "666px" },
                      marginLeft: { xs: "0px", sm: "0em" },
                      fontWeight: 400,
                    }}
                    align="center"
                  >
                    Unleash your creative potential using Promptify, the
                    ultimate ChatGPT and AI-driven content generation and idea
                    inspiration platform. Try it today!
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                sx={{
                  display: "-webkit-box",
                  overflowX: "auto",
                  height: "70px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.4em",
                  width: "100%",
                  padding: "1em 1em",
                }}
              >
                {!!tags && tags.length > 0 && (
                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0.7em",
                      gap: "10px",
                      width: "fit-content",
                      height: "0.7em",
                      background: "transparent",
                      borderRadius: "99px",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "18px",
                      leadingTrim: "both",
                      color: "onSurface",
                    }}
                  >
                    Popular topics:
                  </Typography>
                )}
                {!!tags &&
                  tags.length > 0 &&
                  tags.map((el: Tag) => (
                    <Grid
                      onClick={() => handleTagSelect(el)}
                      key={el.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "8px 12px",
                        minWidth: "63px",
                        height: "36px",
                        borderRadius: "100px",
                        flex: "none",
                        order: 4,
                        flexGrow: 0,
                        background: tagsData.includes(el)
                          ? "#cad3e2"
                          : "#ffffff78",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "0px",
                          gap: "8px",
                          height: "20px",
                          flex: "none",
                          order: 0,
                          flexGrow: 0,
                        }}
                      >
                        {el.name}
                      </Typography>
                    </Grid>
                  ))}
              </Grid>
              <Grid
                sx={{
                  display: "-webkit-box",
                  overflowX: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5em",
                  padding: "1em 1em",
                  width: "100%",
                }}
              >
                {!!categories &&
                  categories.length > 0 &&
                  categories
                    ?.filter((mainCat) => !mainCat.parent)
                    .map((el) => (
                      <Grid
                        onClick={() => handleClickCategory(el.id, el)}
                        key={el.id}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          padding: "10px 12px",
                          gap: "8px",
                          maxWidth: "7em",
                          width: "fit-content",
                          height: "1.5em",
                          background:
                            el.id === categorySelected
                              ? "#cad3e2"
                              : "#ffffff78",
                          borderRadius: "99px",
                          boxSizing: "initial",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Grid
                          sx={{
                            height: "1em",
                            width: "1.5em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TopicImg />
                        </Grid>
                        <Typography
                          title={el.name.length > 22 ? el.name : ""}
                          sx={{
                            display: "flex",
                            fontSize: "0.7em",
                          }}
                        >
                          {el.name.length > 22
                            ? el.name.slice(0, 22) + "..."
                            : el.name}
                        </Typography>
                      </Grid>
                    ))}
              </Grid>

              <TemplatesSection
                isLoading={isTemplateLoading}
                templates={templates}
                filtred={!!filteredTags}
              />
            </Grid>
          </Box>
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
