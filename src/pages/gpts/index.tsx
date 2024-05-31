import { Fragment, useRef } from "react";
import Stack from "@mui/material/Stack";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Layout } from "@/layout";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import HeroSection from "@/components/GPTs/HeroSection";
import CarouselSection from "@/components/GPTs/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import GPTbanner from "@/components/GPTs/GPTbanner";
import { useGetWorkflowByCategoryQuery, useGetUserWorkflowsQuery } from "@/core/api/workflows";

function GPTsPage() {
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const historicalCarouselRef = useRef<HTMLDivElement | null>(null);
  const productivityCarouselRef = useRef<HTMLDivElement | null>(null);
  const { data: workflowsByCategory } = useGetWorkflowByCategoryQuery();
  const { data: userWorkflows } = useGetUserWorkflowsQuery();

  const observers = {
    bannerObserver: useIntersectionObserver(bannerRef, { threshold: 0.5 }),
    historicalCarouselObserver: useIntersectionObserver(historicalCarouselRef, { threshold: 0.5 }),
    productivityCarouselObserver: useIntersectionObserver(productivityCarouselRef, { threshold: 0.5 }),
  };

  const showBanner = observers.bannerObserver?.isIntersecting;
  const showHistoricalCarousel = observers.historicalCarouselObserver?.isIntersecting;

  const filteredUserWorkflows = userWorkflows?.data?.filter(
    workflow => workflow?.template_workflow?.is_schedulable && workflow?.periodic_task,
  );

  const schedulableWorkflows = workflowsByCategory?.flatMap(category =>
    category.templates.filter(workflow => workflow.is_schedulable),
  );
  return (
    <Layout>
      <Stack bgcolor={"white"}>
        <HeroSection />
        <Stack
          mt={{ xs: "40px", md: "80px" }}
          gap={"48px"}
        >
          {filteredUserWorkflows && filteredUserWorkflows.length > 0 && (
            <CarouselSection
              header="Scheduled GPTs"
              subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
            >
              {filteredUserWorkflows?.map((workflow, index) => (
                <Stack
                  key={workflow.id}
                  ml={index === 0 ? "24px" : 0}
                >
                  <WorkflowCard
                    index={index}
                    workflow={workflow?.template_workflow}
                    periodic_task={filteredUserWorkflows[index]?.periodic_task}
                  />
                </Stack>
              ))}
            </CarouselSection>
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

          {schedulableWorkflows && schedulableWorkflows?.length > 0 && (
            <Stack ref={historicalCarouselRef}>
              {showHistoricalCarousel && (
                <CarouselSection
                  header="Historical GPTs"
                  subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
                >
                  {schedulableWorkflows?.map((workflow, index) => (
                    <Stack
                      key={workflow.id}
                      ml={index === 0 ? "24px" : 0}
                    >
                      <WorkflowCard
                        index={index}
                        workflow={workflow}
                      />
                    </Stack>
                  ))}
                </CarouselSection>
              )}
            </Stack>
          )}

          {workflowsByCategory?.map((workflows, index) => (
            <Fragment key={`${workflows.category}-${index}`}>
              <CarouselSection
                header={workflows.category || ""}
                subheader={`Lorem ipsum dolor sit amet consectetur adipisicing elit volantis.`}
              >
                {workflows.templates.map((workflow, index) => (
                  <Stack
                    key={workflow.id}
                    ml={index === 0 ? "24px" : 0}
                  >
                    <WorkflowCard
                      index={index}
                      workflow={workflow}
                    />
                  </Stack>
                ))}
              </CarouselSection>
            </Fragment>
          ))}
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
