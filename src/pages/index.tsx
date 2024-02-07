import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import type { AxiosResponse } from "axios";
import { useSelector, useDispatch } from "react-redux";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { client } from "@/common/axios";
import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { userApi } from "@/core/api/user";
import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import { useGetLatestExecutedTemplatesQuery } from "@/core/api/executions";
import { getPathURL, saveToken } from "@/common/utils";
import { RootState } from "@/core/store";
import { isValidUserFn, updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import ClientOnly from "@/components/base/ClientOnly";
import { GetServerSideProps } from "next/types";
import { getCategories } from "@/hooks/api/categories";
import { Category } from "@/core/api/dto/templates";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import GuestUserLayout from "@/components/Homepage/GuestUserLayout";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

const HomePage = ({ categories }: { categories: Category[] }) => {
  const path = getPathURL();
  const dispatch = useDispatch();
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();
  const { data: myLatestExecutions, isLoading: isMyLatestExecutionsLoading } = useGetLatestExecutedTemplatesQuery(
    undefined,
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

    const { token: _token } = response.data;

    if (!_token) {
      console.error("incoming token for Microsoft authentication is not present:", _token);
      return;
    }

    saveToken({ token: _token });
    const payload = await getCurrentUser(_token).unwrap();

    dispatch(updateUser(payload));
    redirectToPath(path || "/");
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
            <ClientOnly>
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
                  templateLoading={isMyLatestExecutionsLoading}
                  templates={myLatestExecutions}
                  title="Your Latest Templates:"
                  type="myLatestExecutions"
                />
                <TemplatesSection
                  templateLoading={isSuggestedTemplateLoading}
                  templates={suggestedTemplates}
                  title=" You may like these prompt templates:"
                  type="suggestedTemplates"
                />
                <CategoriesSection
                  categories={categories}
                  isLoading={false}
                  displayTitle
                />
              </Grid>
            </ClientOnly>
          ) : (
            <GuestUserLayout categories={categories} />
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Cache-Control", "public, maxage=1800, stale-while-revalidate=30");

  const categories = await getCategories();

  return {
    props: {
      categories,
      title: SEO_TITLE,
      description: SEO_DESCRIPTION,
    },
  };
};

export default HomePage;
