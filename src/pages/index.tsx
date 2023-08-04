import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { NextPage } from "next";

import useToken from "@/hooks/useToken";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { authClient, client } from "@/common/axios";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { categoriesApi } from "@/core/api/categories";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { WelcomeCard } from "@/components/homepage/WelcomeCard";
import { PageLoading } from "@/components/PageLoading";
import { AppDispatch, wrapper } from "@/core/store";
import { Category } from "@/core/api/dto/templates";
import {
  CODE_TOKEN_ENDPOINT,
  doPostLogin,
  postLogin,
} from "@/utils/loginUtils";
import {
  useGetLastTemplatesQuery,
  useGetTemplatesSuggestedQuery,
} from "@/core/api/templates";

interface HomePageProps {
  categories: Category[];
  isCategoryLoading: boolean;
}

const HomePage: NextPage<HomePageProps> = ({
  categories,
  isCategoryLoading,
}) => {
  const token = useToken();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery(token);
  const { data: lastTemplate, isLoading: isLastTemplateLoading } =
    useGetLastTemplatesQuery();
  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } =
    useGetTemplatesSuggestedQuery();

  const [isLoading, setIsLoading] = useState(false);

  const preLogin = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");
    preLogin();

    if (!!authorizationCode && !token) {
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then((r: AxiosResponse<IContinueWithSocialMediaResponse>) =>
          doPostLogin(r, token)
        )
        .catch(() => postLogin(null));
    } else if (authorizationCode && !!token) {
      authClient
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then((r: AxiosResponse<IContinueWithSocialMediaResponse>) =>
          doPostLogin(r, token)
        )
        .catch(() => postLogin(null));
    }
  }, []);

  return (
    <>
      {userLoading ? (
        <PageLoading />
      ) : (
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
      )}
    </>
  );
};

HomePage.getInitialProps = wrapper.getInitialPageProps(
  ({ dispatch }: { dispatch: AppDispatch }) =>
    async () => {
      const { data: categories, isLoading: isCategoryLoading } = await dispatch(
        categoriesApi.endpoints.getCategories.initiate()
      );

      return {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        categories,
        isCategoryLoading,
      };
    }
);

export default HomePage;
