import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { NextPage } from "next";

import useToken from "@/hooks/useToken";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { authClient, client } from "@/common/axios";
import { explorerApi } from "@/core/api/explorer";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { CategoriesApi } from "@/core/api/categories";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { userApi } from "@/core/api/user";
import { WelcomeCard } from "@/components/homepage/WelcomeCard";
import { PageLoading } from "@/components/PageLoading";
import { AppDispatch, wrapper } from "@/core/store";
import { Category, Templates } from "@/core/api/dto/templates";
import { User } from "@/core/api/dto/user";
import {
  CODE_TOKEN_ENDPOINT,
  doPostLogin,
  postLogin,
} from "@/utils/loginUtils";

interface HomePageProps {
  props: {
    user: User;
    userLoading: boolean;
    categories: Category[];
    lastTemplate: Templates;
    suggestedTemplates: Templates[];
    isCategoryLoading: boolean;
    isLastTemplateLoading: boolean;
    isSuggestedTemplateLoading: boolean;
  };
}

const HomePage: NextPage<HomePageProps> = ({ props }) => {
  const {
    user,
    userLoading,
    categories,
    isCategoryLoading,
    lastTemplate,
    isLastTemplateLoading,
    suggestedTemplates,
    isSuggestedTemplateLoading,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  console.log(user, userLoading);

  const savedToken = useToken();

  const preLogin = () => {
    setIsLoading(true);
  };

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
        .then((r: AxiosResponse<IContinueWithSocialMediaResponse>) =>
          doPostLogin(r, savedToken)
        )
        .catch(() => postLogin(null));
    } else if (authorizationCode && !!savedToken) {
      authClient
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then((r: AxiosResponse<IContinueWithSocialMediaResponse>) =>
          doPostLogin(r, savedToken)
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
              {savedToken && user ? (
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
      const token = useToken();
      console.log("tokeenm");

      const user = await dispatch(
        userApi.endpoints.getCurrentUser.initiate(token)
      );
      const lastTemplate = await dispatch(
        explorerApi.endpoints.getLastTemplates.initiate()
      );
      const suggestedTemplates = await dispatch(
        explorerApi.endpoints.getTemplatesSuggested.initiate()
      );
      const categories = await dispatch(
        CategoriesApi.endpoints.getCategories.initiate()
      );

      return {
        props: {
          user: user.data,
          lastTemplate: lastTemplate.data,
          suggestedTemplates: suggestedTemplates.data,
          categories: categories.data,
          isLastTemplateLoading: lastTemplate.isLoading,
          isSuggestedTemplateLoading: suggestedTemplates.isLoading,
          isCategoryLoading: categories.isLoading,
          userLoading: user.isLoading,
        },
      };
    }
);

export default HomePage;
