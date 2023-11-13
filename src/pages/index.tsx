import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import { NextPage } from "next";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { client } from "@/common/axios";
import { Layout } from "@/layout";
import { userApi } from "@/core/api/user";
import { WelcomeCard } from "@/components/homepage/WelcomeCard";
import { getPathURL, saveToken } from "@/common/utils";
import { RootState } from "@/core/store";
import { isValidUserFn, updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import ClientOnly from "@/components/base/ClientOnly";
import { NextResponse } from "next/server";

// Import only specific components or functions from MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// Import only needed types from your API
import { Category } from "@/core/api/dto/templates";

// Import only the necessary function from the categories hook
import { getCategories } from "@/hooks/api/categories";

// Import Layout
// const Layout = dynamic(() => import("@/layout").then(mod => mod.Layout));

const CategoriesSection = dynamic(() =>
  import("@/components/explorer/CategoriesSection").then(mod => mod.CategoriesSection),
);

const TemplatesData = dynamic(() => import("@/components/homepage/TemplatesData").then(mod => mod.TemplatesData));

// Import WelcomeCard using dynamic
// const WelcomeCard = dynamic(() => import("@/components/homepage/WelcomeCard").then(mod => mod.WelcomeCard));

interface HomePageProps {
  categories: Category[];
}

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

const HomePage: NextPage<HomePageProps> = ({ categories }) => {
  const path = getPathURL();
  const dispatch = useDispatch();
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();

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
            <ClientOnly>
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
                  <TemplatesData />
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
                  <TemplatesData />
                </>
              )}
            </ClientOnly>
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export async function getServerSideProps({
  res,
}: {
  res: NextResponse & { setHeader: (name: string, value: string) => void };
}) {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60");

  const categories = await getCategories();

  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      categories,
    },
  };
}

// export async function getStaticProps() {
//   const categories = await getCategories();

//   return {
//     props: {
//       title: "Promptify | Boost Your Creativity",
//       description:
//         "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
//       categories,
//     },
//   };
// }

export default HomePage;
