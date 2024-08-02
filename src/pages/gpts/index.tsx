import { Fragment, useRef, useState } from "react";
import lazy from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Layout } from "@/layout";
import { useGetWorkflowByCategoryQuery, useGetUserWorkflowsQuery, useGetWorkflowsQuery } from "@/core/api/workflows";
import { useAppSelector } from "@/hooks/useStore";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import HeroSection from "@/components/GPTs/Sections/HeroSection";
import CarouselSection from "@/components/GPTs/Sections/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import GPTbanner from "@/components/GPTs/GPTbanner";

const GPTsSection = lazy(() => import("@/components/GPTs/Sections/GPTsSection"), {
  ssr: false,
});
const GPTsByCategorySection = lazy(() => import("@/components/GPTs/Sections/CategoryGPTsSection"), {
  ssr: false,
});

function GPTsPage() {
  const searchParams = useSearchParams();

  const currentUser = useAppSelector(state => state.user.currentUser ?? null);

  const { data: userWorkflows, isLoading: isLoadingUserWorkflows } = useGetUserWorkflowsQuery(undefined, {
    skip: !currentUser?.id,
  });
  const { data: allWorkflows, isLoading: isLoadingAllWorkflows } = useGetWorkflowsQuery(
    searchParams.get("enable") === "true",
  );

  const [filter, setFilter] = useState("");

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const historicalCarouselRef = useRef<HTMLDivElement | null>(null);
  const GPTCategoriesCarouselRef = useRef<HTMLDivElement | null>(null);
  const newGPTsCarouselRef = useRef<HTMLDivElement | null>(null);

  const observers = {
    bannerObserver: useIntersectionObserver(bannerRef, { threshold: 0.5 }),
    historicalCarouselObserver: useIntersectionObserver(historicalCarouselRef, { threshold: 0.5 }),
    GPTCategoriesCarouselObserver: useIntersectionObserver(GPTCategoriesCarouselRef, { threshold: 0.5 }),
    newGPTsCarouselObserver: useIntersectionObserver(newGPTsCarouselRef, { threshold: 0.5 }),
  };

  const showBanner = observers.bannerObserver?.isIntersecting;
  const showHistoricalCarousel = observers.historicalCarouselObserver?.isIntersecting;
  const showNewGPTsCarousel = observers.historicalCarouselObserver?.isIntersecting;
  const showGPTCategoriesCarousel = observers.GPTCategoriesCarouselObserver?.isIntersecting;

  const { data: workflowsByCategory, isLoading: isLoadingWorkflowsByCategory } = useGetWorkflowByCategoryQuery(
    undefined,
    { skip: !showGPTCategoriesCarousel },
  );

  const isFiltering = filter.length > 0;

  const userFavoriteeWorkflows = workflowsByCategory?.flatMap(category =>
    category.templates.filter(workflow => workflow.is_liked),
  );
  const scheduleGPTs = userWorkflows?.data?.filter(
    workflow => workflow?.template_workflow?.is_schedulable && workflow?.periodic_task,
  );

  const filteredAllWorkflows = isFiltering
    ? allWorkflows?.filter(workflow => workflow.name.toLowerCase().includes(filter.toLowerCase()))
    : [];

  const latestCreatedWorkflows = allWorkflows
    ?.slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const recentlyUserdWorkflows = userWorkflows?.data
    ?.filter(workflow => workflow.last_executed)
    .sort((a, b) => {
      const dateA = a.last_executed ? new Date(a.last_executed).getTime() : 0;
      const dateB = b.last_executed ? new Date(b.last_executed).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <Layout>
      <Stack
        bgcolor={"white"}
        pb={7}
      >
        <HeroSection onFilter={setFilter} />
        <Stack
          mt={{ xs: "40px", md: "80px" }}
          gap={"48px"}
        >
          {isFiltering ? (
            <Fragment>
              {filteredAllWorkflows && filteredAllWorkflows.length > 0 ? (
                <CarouselSection
                  header="Filtered Workflows"
                  subheader="Results matching your search criteria."
                >
                  {filteredAllWorkflows.map((workflow, index) => (
                    <Stack
                      key={workflow.id}
                      ml={index === 0 ? "24px" : 0}
                    >
                      <WorkflowCard
                        templateWorkflow={workflow}
                        periodic_task={workflow.periodic_task}
                        lastExecuted={null}
                      />
                    </Stack>
                  ))}
                </CarouselSection>
              ) : (
                <Typography
                  sx={{
                    minHeight: "40vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No workflows match your search criteria.
                </Typography>
              )}
            </Fragment>
          ) : (
            <Fragment>
              <GPTsSection
                header="Scheduled AI Apps"
                subheader="Easily view, pause, or tweak your scheduled Promptify AI Apps. 
                Stay on top of your tasks and keep your workflow smooth and flexible."
                workflows={scheduleGPTs}
                isLoading={isLoadingUserWorkflows}
                isGPTScheduled
              />

              <Stack
                ref={bannerRef}
                px={{ xs: "24px", md: "80px" }}
              >
                {showBanner && (
                  <GPTbanner
                    title="Summarize your daily inbox"
                    description="A summary of your Gmail inbox"
                    href="/gpts/summarize-your-daily-inbox"
                  />
                )}
              </Stack>

              <Stack ref={newGPTsCarouselRef}>
                {showNewGPTsCarousel && (
                  <GPTsSection
                    header="Recently Used AI Apps"
                    subheader="Quickly access and reuse the Promptify AI Apps you've recently employed to ensure continuity and efficiency in your ongoing tasks."
                    workflows={recentlyUserdWorkflows}
                    isLoading={isLoadingUserWorkflows}
                  />
                )}
              </Stack>

              <Stack ref={newGPTsCarouselRef}>
                {showNewGPTsCarousel && (
                  <GPTsSection
                    header="Latest AI Apps"
                    subheader="Discover the latest Promptify AI Apps to amplify your productivity. Stay ahead, keep things fresh,
                     and make daily tasks a breeze with cutting-edge Generative AI."
                    workflows={latestCreatedWorkflows}
                    isLoading={isLoadingAllWorkflows}
                  />
                )}
              </Stack>

              <Stack ref={historicalCarouselRef}>
                {showHistoricalCarousel && (
                  <GPTsSection
                    header="User Favorites"
                    subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
                    workflows={userFavoriteeWorkflows}
                    isLoading={isLoadingUserWorkflows}
                  />
                )}
              </Stack>

              <Stack ref={GPTCategoriesCarouselRef}>
                {showGPTCategoriesCarousel && (
                  <GPTsByCategorySection
                    workflowCategories={workflowsByCategory}
                    isLoading={isLoadingWorkflowsByCategory}
                  />
                )}
              </Stack>
            </Fragment>
          )}
        </Stack>
      </Stack>
    </Layout>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "AI Apps",
      description: AUTOMATION_DESCRIPTION,
    },
  };
}

export default GPTsPage;
