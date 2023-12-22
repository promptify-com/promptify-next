import React from "react";
import { useSelector } from "react-redux";
import { isValidUserFn } from "@/core/store/userSlice";
import { Box, Grid, Typography } from "@mui/material";
import ClientOnly from "./base/ClientOnly";
import { TemplatesSection } from "./explorer/TemplatesSection";
import { CategoriesSection } from "./explorer/CategoriesSection";
import { WelcomeCard } from "./homepage/WelcomeCard";
import useToken from "@/hooks/useToken";
import { useAppSelector } from "@/hooks/useStore";
import { useGetLatestExecutedTemplatesQuery } from "@/core/api/executions";
import { useGetTemplatesByFilterQuery, useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import { useGetCategoriesQuery } from "@/core/api/categories";

interface Props {}

const Landing: React.FC<Props> = () => {
  const token = useToken();
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { data: myLatestExecutions, isLoading: isMyLatestExecutionsLoading } = useGetLatestExecutedTemplatesQuery(
    undefined,
    {
      skip: !isValidUser,
    },
  );
  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } = useGetTemplatesSuggestedQuery(undefined, {
    skip: !isValidUser,
  });
  const { data: popularTemplates, isLoading: isPopularTemplatesLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 7,
    },
    {
      skip: token,
    },
  );
  const { data: latestTemplates, isLoading: isLatestTemplatesLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-created_at",
      limit: 7,
    },
    {
      skip: token,
    },
  );
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  return (
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
              <TemplatesSection
                isLatestTemplates
                isLoading={isMyLatestExecutionsLoading}
                templates={myLatestExecutions || []}
                title="Your Latest Templates:"
                type="myLatestExecutions"
              />
              <TemplatesSection
                isLoading={isSuggestedTemplateLoading}
                templates={suggestedTemplates}
                title=" You may like these prompt templates:"
                type="suggestedTemplates"
              />
              <CategoriesSection
                categories={categories}
                isLoading={isCategoriesLoading}
              />
            </Grid>
          ) : (
            <>
              <WelcomeCard />
              <CategoriesSection
                categories={categories}
                isLoading={isCategoriesLoading}
              />
              <TemplatesSection
                isLoading={isPopularTemplatesLoading}
                templates={popularTemplates?.results}
                title="Most Popular Prompt Templates"
                type="popularTemplates"
              />
              <TemplatesSection
                isLoading={isLatestTemplatesLoading}
                templates={latestTemplates?.results}
                title="Latest Prompt Templates"
                type="latestTemplates"
              />
            </>
          )}
        </ClientOnly>
      </Grid>
    </Box>
  );
};

export default Landing;
