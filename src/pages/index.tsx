import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { client } from "@/common/axios";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { categoriesApi } from "@/core/api/categories";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { userApi } from "@/core/api/user";
import { WelcomeCard } from "@/components/homepage/WelcomeCard";
import {
  useGetLastTemplatesQuery,
  useGetTemplatesSuggestedQuery,
} from "@/core/api/templates";
import { getPathURL, saveToken } from "@/common/utils";
import { AppDispatch, RootState, wrapper } from "@/core/store";
import { isValidUserFn, updateUser } from '@/core/store/userSlice';
import { Category } from "@/core/api/dto/templates";

interface HomePageProps {
  categories: Category[];
}

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

const HomePage: NextPage<HomePageProps> = ({
  categories,
}) => {
  const router = useRouter();
  const path = getPathURL();
  const dispatch = useDispatch();
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [getCurrentUser] =
    userApi.endpoints.getCurrentUser.useLazyQuery();
  const { data: lastTemplate, isLoading: isLastTemplateLoading } =
    useGetLastTemplatesQuery(undefined, { skip: !isValidUser });
  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } =
    useGetTemplatesSuggestedQuery(undefined, { skip: !isValidUser });

  // TODO: move authentication logic to signin page instead
  const doPostLogin = async (
    response: AxiosResponse<IContinueWithSocialMediaResponse>,
  ) => {
    if (typeof response.data !== "object" || response.data === null) {
      console.error('incoming data for Microsoft authentication is not an object:', response.data);
      return;
    }

    const { token, created } = response.data;

    // TODO: find out what this mysterious prop means
    if (created) {
      router.push({
        pathname: "/signin",
        query: { from: "signup" },
      });
      return;
    }

    if (!token) {
      console.error('incoming token for Microsoft authentication is not present:', token);
      return;
    }

    saveToken({ token });
    const payload = await getCurrentUser(token).unwrap();
    dispatch(updateUser(payload));

    router.push(path || "/");
  };

  // TODO: move authentication logic to signin page instead
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");

    if (!!authorizationCode) {
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then((response: AxiosResponse<IContinueWithSocialMediaResponse>) => {
          doPostLogin(response);
        })
        .catch((reason) => {
          console.warn('Could not authenticate via Microsoft:', reason);
        });
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
            {isValidUser ? (
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
                    Welcome, {currentUser?.username}
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
                <CategoriesSection
                  categories={categories}
                  isLoading={isValidUser}
                />
              </Grid>
            ) : (
              <>
                <CategoriesSection
                  categories={categories}
                  isLoading={isValidUser}
                />
                <WelcomeCard />
              </>
            )}
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

// TODO: getInitialProps is a legacy API, converting this code into getServerSideProps is an option
HomePage.getInitialProps = wrapper.getInitialPageProps(
  ({ dispatch }: { dispatch: AppDispatch }) =>
    async () => {
      const { data: categories } = await dispatch(
        categoriesApi.endpoints.getCategories.initiate()
      );

      return {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        categories,
      };
    }
);

export default HomePage;
