import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import { Category } from "@/core/api/dto/templates";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ClientOnly from "@/components/base/ClientOnly";
import { useAppSelector } from "@/hooks/useStore";
import { useGetLatestExecutedTemplatesQuery } from "@/core/api/executions";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";

function HomepageLayout({ categories }: { categories: Category[] }) {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { data: myLatestExecutions, isLoading: isMyLatestExecutionsLoading } =
    useGetLatestExecutedTemplatesQuery(undefined);
  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } = useGetTemplatesSuggestedQuery(undefined);

  return (
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
  );
}

export default HomepageLayout;
