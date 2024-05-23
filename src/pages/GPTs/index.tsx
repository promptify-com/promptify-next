import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import HeroSection from "@/components/GPTs/HeroSection";
import CarouselSection from "@/components/GPTs/CarouselSection";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import GPTbanner from "@/components/GPTs/GPTbanner";

function GPTsPage() {
  return (
    <Layout>
      <Stack bgcolor={"white"}>
        <HeroSection />
        <Stack
          mt={"28px"}
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
                <WorkflowCard index={index} />
              </Stack>
            ))}
          </CarouselSection>
          <Stack px={{ xs: "24px", md: "80px" }}>
            <GPTbanner
              title="Summarize your daily inbox"
              description="A summary of your Gmail inbox"
              href="#"
            />
          </Stack>
          <CarouselSection
            header="Historical GPTs"
            subheader="Lorem ipsum dolor sit amet consectetur adipisicing elit volantis."
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Stack
                key={index}
                ml={index === 0 ? "24px" : 0}
              >
                <WorkflowCard index={index} />
              </Stack>
            ))}
          </CarouselSection>
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
