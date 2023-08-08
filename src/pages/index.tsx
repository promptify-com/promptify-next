import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { NextPage } from "next";

import useToken from "@/hooks/useToken";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { authClient, client } from "@/common/axios";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { categoriesApi, useGetCategoriesQuery } from "@/core/api/categories";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { useGetCurrentUserQuery, userApi } from "@/core/api/user";
import { WelcomeCard } from "@/components/homepage/WelcomeCard";
import { PageLoading } from "@/components/PageLoading";
import { AppDispatch, wrapper } from "@/core/store";
import { Category } from "@/core/api/dto/templates";
import { useRouter } from "next/router";
import {
  useGetLastTemplatesQuery,
  useGetTemplatesSuggestedQuery,
} from "@/core/api/templates";
import { getPathURL, saveToken } from "@/common/utils";

const HomePage: NextPage = () => {
  const token = useToken();
  const router = useRouter();
  const path = getPathURL();

  const [trigger, { data: user, isLoading: _userLoading }] =
    userApi.endpoints.getCurrentUser.useLazyQuery();
  useEffect(() => {
    if (token) {
      trigger(token);
    }
  }, [token]);

  const isValidUser = Boolean(user?.id && token);

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  const { data: lastTemplate, isLoading: isLastTemplateLoading } =
    useGetLastTemplatesQuery(undefined, { skip: !isValidUser });
  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } =
    useGetTemplatesSuggestedQuery(undefined, { skip: !isValidUser });

  const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

  const postLogin = (response: IContinueWithSocialMediaResponse | null) => {
    if (!response) return;
    if (response?.created) {
      router.push("/signup");
    } else {
      if (path) {
        trigger(token);
        router.push(path);
      }
    }
  };

  const doPostLogin = (
    r: AxiosResponse<IContinueWithSocialMediaResponse>,
    savedToken: string | null | undefined
  ) => {
    const { token } = r.data;
    if (!!savedToken && token !== savedToken) {
      if (path) {
        router.push(path);
        trigger(token);

        localStorage.setItem("from", "alert");
      }
    } else {
      saveToken(r.data);
      trigger(token);

      postLogin(r.data);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");

    if (!!authorizationCode && !token) {
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then((r: AxiosResponse<IContinueWithSocialMediaResponse>) => {
          doPostLogin(r, token);
        })
        .catch(() => postLogin(null));
    } else if (authorizationCode && !!token) {
      authClient
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then((r: AxiosResponse<IContinueWithSocialMediaResponse>) => {
          doPostLogin(r, token);
        })
        .catch(() => postLogin(null));
    }
  }, []);

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
            {token && user ? (
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
                    isLoading={isLastTemplateLoading}
                    templates={[lastTemplate]}
                    title="Your Latest Template:"
                  />
                )}

                <TemplatesSection
                  isLoading={isSuggestedTemplateLoading}
                  templates={suggestedTemplates}
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
};
export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default HomePage;
