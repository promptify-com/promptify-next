import { useRef } from "react";
import Stack from "@mui/material/Stack";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Layout } from "@/layout";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import HeroSection from "@/components/GPTs/HeroSection";
import CarouselSection from "@/components/GPTs/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import GPTbanner from "@/components/GPTs/GPTbanner";

function GPTsPage() {
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const historicalCarouselRef = useRef<HTMLDivElement | null>(null);

  const observers = {
    bannerObserver: useIntersectionObserver(bannerRef, { threshold: 0.5 }),
    historicalCarouselObserver: useIntersectionObserver(historicalCarouselRef, { threshold: 0.5 }),
  };

  const showBanner = observers.bannerObserver?.isIntersecting;
  const showHistoricalCarousel = observers.historicalCarouselObserver?.isIntersecting;
  return (
    <Layout>
      <Stack bgcolor={"white"}>
        <HeroSection />
        <Stack
          mt={{ xs: "40px", md: "80px" }}
          gap={"48px"}
        >
          <CarouselSection
            header="Scheduled GPTs"
            subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Stack
                key={index}
                ml={index === 0 ? "24px" : 0}
              >
                <WorkflowCard
                  index={index}
                  href={"/automation/summarize-your-daily-inbox"}
                />
              </Stack>
            ))}
          </CarouselSection>
          <Stack
            ref={bannerRef}
            px={{ xs: "24px", md: "80px" }}
          >
            {showBanner && (
              <GPTbanner
                title="Summarize your daily inbox"
                description="A summary of your Gmail inbox"
                href="/automation/summarize-your-daily-inbox"
              />
            )}
          </Stack>
          <Stack ref={historicalCarouselRef}>
            {showHistoricalCarousel && (
              <CarouselSection
                header="Historical GPTs"
                subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <Stack
                    key={index}
                    ml={index === 0 ? "24px" : 0}
                  >
                    <WorkflowCard
                      index={index}
                      href={"/automation/summarize-your-daily-inbox"}
                    />
                  </Stack>
                ))}
              </CarouselSection>
            )}
          </Stack>
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
