import Head from "next/head";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { CustomTemplates } from "@/components/explorer/Templates";
import { Header } from "@/components/blocks/Header";
import { PageLoading } from "@/components/PageLoading";
import useSetUser from "@/hooks/useSetUser";
import useToken from "@/hooks/useToken";
import { TopicImg } from "@/assets/icons/TopicImg";
import { useRouter } from "next/router";
import {
  useGetCategoriesQuery,
  useGetTagsPopularQuery,
} from "@/core/api/explorer";
import { Category, Tag } from "@/core/api/dto/templates";
import { ICollection } from "@/common/types/collection";
import { useCollection } from "@/hooks/api/collections";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { getPathURL, saveToken } from "@/common/utils";
import { AxiosResponse } from "axios";
import { authClient, client } from "@/common/axios";
import SearchBar from "@/components/explorer/SearchBar";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function Home() {
  const router = useRouter();
  const setUser = useSetUser();
  const savedToken = useToken();

  const tag = router.query?.tag;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [collections, setCollections] = React.useState<ICollection[]>([]);
  const [isLoadingCollection, setIsLoadingCollection] =
    React.useState<boolean>(false);
  const [categorySelected, setCategorySelected] = React.useState<number>();
  const [selectedTag, setSelectedTag] = React.useState<Tag[]>([]);
  const [keyWord, setKeyWord] = React.useState<string>("");
  const { data: tags } = useGetTagsPopularQuery();
  const { data: categories } = useGetCategoriesQuery();
  const preLogin = () => {
    setIsLoading(true);
  };
  const [useDeferredAction] = useCollection();

  useEffect(() => {
    setIsLoadingCollection(true);
    useDeferredAction()
      .then((res: any) => {
        setCollections(res);
        setIsLoadingCollection(false);
      })
      .catch(() => {
        setIsLoadingCollection(false);
      });
  }, []);
  const postLogin = (response: IContinueWithSocialMediaResponse | null) => {
    if (!response) return;
    if (response && response.created) {
      setUser(response);
      router.push("/signup");
    } else {
      const path = getPathURL();
      // localStorage.removeItem('path')
      if (!!path) {
        router.push(path);
      }
    }
    setIsLoading(false);
  };

  const doPostLogin = (r: AxiosResponse<IContinueWithSocialMediaResponse>) => {
    const { token } = r.data;
    if (!!savedToken && token !== savedToken) {
      const path = getPathURL();
      if (!!path) {
        router.push(path);
        localStorage.setItem("from", "alert");
      }
      return;
    } else {
      setUser(r.data);
      saveToken(r.data);
      postLogin(r.data);
    }
  };

  const handleClickCategory = (el: number, category: Category) => {
    router.push({
      pathname: `/explorer/details`,
      query: { category: JSON.stringify(category) },
    });
    setCategorySelected(el);
  };

  const handleClickTag = (tag: Tag) => {
    if (selectedTag.find((item) => item.id === tag.id)) {
      const removeTag = selectedTag.filter((el) => el.id !== tag.id);
      setSelectedTag(removeTag);
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  React.useEffect(() => {
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
      <Head>
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        {isLoading ? (
          <PageLoading />
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                backgroundSize: "cover",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "grey.300",
                paddingBottom: "1em",
              }}
            >
              <Header transparent keyWord={keyWord} setKeyWord={setKeyWord} />
              <Grid
                container
                flexDirection="column"
                display={"flex"}
                sx={{
                  padding: "1em",
                }}
                rowGap={2}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
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
                      lineHeight: "72px",
                      color: "#1D2028",
                      marginLeft: { xs: "0px", sm: "0px" },
                    }}
                  >
                    Welcome to Promptify
                  </Typography>
                </Grid>
                <Grid
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1em",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "90%", sm: "57%" },
                    marginLeft: { xs: "0em", sm: "4em" },
                    maxWidth: "700px",
                  }}
                >
                  <SearchBar
                    keyWord={keyWord}
                    setKeyWord={setKeyWord}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    from="middle"
                  />
                </Box>
              </Grid>
              <Grid
                className="scroll-class-name"
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
                    onClick={() => setSelectedTag([])}
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
                      textEdge: "cap",
                      color: "#1D202",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    Popular topics:
                  </Typography>
                )}
                {!!tags &&
                  tags.length > 0 &&
                  tags.map((el, idx) => (
                    <Grid
                      onClick={() => handleClickTag(el)}
                      key={idx}
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
                        background: selectedTag.find(
                          (item) => item.id === el.id
                        )
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
                className="scroll-class-name"
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
                    .map((el, idx) => (
                      <Grid
                        onClick={() => handleClickCategory(el.id, el)}
                        key={idx}
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
            </Box>

            <CustomTemplates
              isLoadingCollection={isLoadingCollection}
              selectedTag={selectedTag}
              keyWord={keyWord}
              collections={collections}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default Home;
