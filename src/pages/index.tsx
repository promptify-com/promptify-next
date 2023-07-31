import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";

import useSetUser from "@/hooks/useSetUser";
import useToken from "@/hooks/useToken";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { getPathURL, saveToken } from "@/common/utils";
import { authClient, client } from "@/common/axios";
import {
  useGetTemplatesSuggestedQuery,
  useGetLastTemplatesQuery,
} from "@/core/api/explorer";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { WelcomeCard } from "@/components/homepage/WelcomeCard";

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
      <Layout>
        <Box mt={{ xs: 7, md: 0 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
          <Grid
            gap={"56px"}
            display={"flex"}
            flexDirection={"column"}
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            {user && savedToken ? (
              <Grid flexDirection="column" display={"flex"} gap={"56px"}>
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
                {lastTemplate && Object.keys(lastTemplate).length > 0 && (
                  <TemplatesSection
                    isLoading={islastTemplateLoading}
                    templates={[lastTemplate]}
                    title="Your Latest Template:"
                  />
                )}

                <TemplatesSection
                  isLoading={isTemplatesLoading}
                  templates={templates}
                  title="You may like this templates:"
                />
              </Grid>
            ) : (
              <WelcomeCard />
            )}
            <CategoriesSection
              categories={categories}
              isLoading={isCategoryLoading}
            />
          </Grid>
        </Box>
      </Layout>
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
