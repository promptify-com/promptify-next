import { Fragment, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Layout } from "@/layout";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import HeroSection from "@/components/GPTs/HeroSection";
import CarouselSection from "@/components/GPTs/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import GPTbanner from "@/components/GPTs/GPTbanner";
import { useGetWorkflowByCategoryQuery, useGetUserWorkflowsQuery, useGetWorkflowsQuery } from "@/core/api/workflows";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCardPlaceholder";

function GPTsPage() {
  const searchParams = useSearchParams();

  const { data: workflowsByCategory, isLoading: isLoadingWorkflowsByCategory } = useGetWorkflowByCategoryQuery();
  const { data: userWorkflows, isLoading: isLoadingUserWorkflows } = useGetUserWorkflowsQuery();

  const [filter, setFilter] = useState("");

  const { data: allWorkflows, isLoading: isLoadingAllWorkflows } = useGetWorkflowsQuery(
    searchParams.get("enable") === "true",
  );

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const historicalCarouselRef = useRef<HTMLDivElement | null>(null);
  const productivityCarouselRef = useRef<HTMLDivElement | null>(null);

  const observers = {
    bannerObserver: useIntersectionObserver(bannerRef, { threshold: 0.5 }),
    historicalCarouselObserver: useIntersectionObserver(historicalCarouselRef, { threshold: 0.5 }),
    productivityCarouselObserver: useIntersectionObserver(productivityCarouselRef, { threshold: 0.5 }),
  };

  const showBanner = observers.bannerObserver?.isIntersecting;
  const showHistoricalCarousel = observers.historicalCarouselObserver?.isIntersecting;

  const schedulableWorkflows = workflowsByCategory?.flatMap(category =>
    category.templates.filter(workflow => workflow.is_schedulable),
  );

  const filteredUserWorkflows = userWorkflows?.data?.filter(
    workflow => workflow?.template_workflow?.is_schedulable && workflow?.periodic_task,
  );

  const isFiltering = filter.length > 0;

  const filteredAllWorkflows = isFiltering
    ? allWorkflows?.filter(workflow => workflow.name.toLowerCase().includes(filter.toLowerCase()))
    : [];

  const sortedWorkflows = allWorkflows
    ?.slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
                        index={index}
                        workflow={workflow}
                        periodic_task={workflow.periodic_task}
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
              {isLoadingUserWorkflows ? (
                <WorkflowCardPlaceholder />
              ) : (
                filteredUserWorkflows &&
                filteredUserWorkflows.length > 0 && (
                  <CarouselSection
                    header="Scheduled GPTs"
                    subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
                  >
                    {filteredUserWorkflows?.map((workflow, index) => (
                      <Stack key={workflow.id}>
                        <WorkflowCard
                          index={index}
                          workflow={workflow?.template_workflow}
                          periodic_task={workflow?.periodic_task}
                          workflowId={workflow.id}
                        />
                      </Stack>
                    ))}
                  </CarouselSection>
                )
              )}

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

              {isLoadingAllWorkflows ? (
                <WorkflowCardPlaceholder />
              ) : (
                sortedWorkflows &&
                sortedWorkflows.length > 0 && (
                  <Stack ref={historicalCarouselRef}>
                    {showHistoricalCarousel && (
                      <CarouselSection
                        header="New GPTs"
                        subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
                      >
                        {sortedWorkflows.map((workflow, index) => (
                          <Stack key={workflow.id}>
                            <WorkflowCard
                              index={index}
                              workflow={workflow}
                            />
                          </Stack>
                        ))}
                      </CarouselSection>
                    )}
                  </Stack>
                )
              )}

              {isLoadingWorkflowsByCategory ? (
                <WorkflowCardPlaceholder />
              ) : (
                schedulableWorkflows &&
                schedulableWorkflows.length > 0 && (
                  <Stack ref={historicalCarouselRef}>
                    {showHistoricalCarousel && (
                      <CarouselSection
                        header="Historical GPTs"
                        subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
                      >
                        {schedulableWorkflows.map((workflow, index) => (
                          <Stack key={workflow.id}>
                            <WorkflowCard
                              index={index}
                              workflow={workflow}
                            />
                          </Stack>
                        ))}
                      </CarouselSection>
                    )}
                  </Stack>
                )
              )}

              {isLoadingWorkflowsByCategory ? (
                <WorkflowCardPlaceholder />
              ) : (
                workflowsByCategory?.map((workflows, index) => (
                  <Fragment key={`${workflows.category}-${index}`}>
                    <CarouselSection
                      header={workflows.category || ""}
                      subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
                    >
                      {workflows.templates.map((workflow, index) => (
                        <Stack key={workflow.id}>
                          <WorkflowCard
                            index={index}
                            workflow={workflow}
                          />
                        </Stack>
                      ))}
                    </CarouselSection>
                  </Fragment>
                ))
              )}
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
      title: "GPTs",
      description: AUTOMATION_DESCRIPTION,
    },
  };
}

export default GPTsPage;
