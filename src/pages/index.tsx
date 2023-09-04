import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { client } from "@/common/axios";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { userApi } from "@/core/api/user";
import { WelcomeCard } from "@/components/homepage/WelcomeCard";
import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/executions";
import { getPathURL, saveToken } from "@/common/utils";
import { RootState } from "@/core/store";
import { isValidUserFn, updateUser } from "@/core/store/userSlice";
import { Category } from "@/core/api/dto/templates";
import { authClient } from "@/common/axios";

interface HomePageProps {
  categories: Category[];
}

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";
const MY_EXECUTIONS_LIMIT = 4;

const HomePage: NextPage<HomePageProps> = ({ categories }) => {
  const router = useRouter();
  const path = getPathURL();
  const dispatch = useDispatch();
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();
  const { data: myLatestExecutions, isLoading: isMyLatestExecutionsLoading } = useGetTemplatesExecutionsByMeQuery(
    MY_EXECUTIONS_LIMIT,
    {
      skip: !isValidUser,
    },
  );
  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } = useGetTemplatesSuggestedQuery(undefined, {
    skip: !isValidUser,
  });

  // TODO: move authentication logic to signin page instead
  const doPostLogin = async (response: AxiosResponse<IContinueWithSocialMediaResponse>) => {
    if (typeof response.data !== "object" || response.data === null) {
      console.error("incoming data for Microsoft authentication is not an object:", response.data);
      return;
    }

    const { token } = response.data;

    if (!token) {
      console.error("incoming token for Microsoft authentication is not present:", token);
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
        .catch(reason => {
          console.warn("Could not authenticate via Microsoft:", reason);
        });
    }
  }, []);

  return (
    <>
      <Layout>
        <Box
          mt={{ xs: 7, md: 0 }}
          padding={{ xs: "4px 0px", md: "0px 8px" }}
        >
          <Grid
            gap={"56px"}
            display={"flex"}
            flexDirection={"column"}
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            {isValidUser ? (
              <Grid
                flexDirection="column"
                display={"flex"}
                gap={"56px"}
              >
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
                <TemplatesSection
                  isLatestTemplates
                  isLoading={isMyLatestExecutionsLoading}
                  templates={myLatestExecutions}
                  title="Your Latest Templates:"
                  type="yourLatestTemplates"
                />
                <TemplatesSection
                  isLoading={isSuggestedTemplateLoading}
                  templates={suggestedTemplates}
                  title="You may like these templates:"
                />
                <CategoriesSection
                  categories={categories}
                  isLoading={!isValidUser}
                />
              </Grid>
            ) : (
              <>
                <WelcomeCard />
                <CategoriesSection
                  categories={categories}
                  isLoading={isValidUser}
                />
              </>
            )}
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  const responseCategories = await authClient.get("/api/meta/categories/");
  const categories = responseCategories.data;

  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      categories,
    },
  };
}

export default HomePage;
