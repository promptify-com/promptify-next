import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ClientOnly from "@/components/base/ClientOnly";
import CategoryCarousel from "@/components/common/CategoriesCarousel";
import Learn from "@/components/Homepage/GuestUserLayout/Learn";
import Testimonials from "@/components/Homepage/GuestUserLayout/Testimonials";
import SuggestionsSection from "@/components/Homepage/SuggestionsSection";
import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import HomepageTemplates from "@/components/Homepage/HomepageTemplates";
import type { Category } from "@/core/api/dto/templates";

function HomepageLayout({ categories }: { categories: Category[] }) {
  const { data: suggestedTemplates, isLoading } = useGetTemplatesSuggestedQuery(undefined);

  return (
    <ClientOnly>
      <Grid
        mt={{ xs: 4, md: 0 }}
        flexDirection="column"
        display={"flex"}
        gap={{ xs: "35px", md: "80px" }}
        mx={{ md: "50px" }}
        maxWidth={{ xs: "90vw", md: "fit-content" }}
        data-testid="logged-in-main-container"
      >
        <SuggestionsSection />

        <HomepageTemplates
          title="You may like these prompts:"
          templates={suggestedTemplates || []}
          templatesLoading={isLoading}
          showAdsBox
        />

        <Stack mr={{ md: "16px" }}>
          <CategoryCarousel
            categories={categories}
            userScrolled={false}
            href="/explore"
            gap={1}
            explore
            autoPlay
          />
        </Stack>

        <Learn />
        <Testimonials />
      </Grid>
    </ClientOnly>
  );
}

export default HomepageLayout;
