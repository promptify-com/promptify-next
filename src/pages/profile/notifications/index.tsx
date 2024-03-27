import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import Stack from "@mui/material/Stack";
import StackedSwitch from "@/components/common/forms/StackedSwitch";

function ProfileNotifications() {
  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Notifications"
          description="Here, you can customize your notification preferences to stay updated on important events and activities."
        >
          <SectionWrapper
            title="Offline events"
            description="Notifications via email, while you are offline"
            noBorder
          >
            <Stack gap={2}>
              <StackedSwitch
                title="Generation finished"
                description="Notify me when prompt generation is finished"
                checked={false}
                onChange={() => console.log("check Generation finished")}
              />
              <StackedSwitch
                title="GPT notification"
                description="Allow GPT’s send me notifications"
                checked={false}
                onChange={() => console.log("GPT notification finished")}
              />
            </Stack>
          </SectionWrapper>
          <SectionWrapper
            title="Events & Updates"
            description="Informational mailings"
            noBorder
          >
            <Stack gap={2}>
              <StackedSwitch
                title="Monthly report"
                description="Regular update with statistic of your prompts and platform highlights"
                checked={false}
                onChange={() => console.log("Monthly report finished")}
              />
              <StackedSwitch
                title="Newsletter"
                description="Regular update with blog posts"
                checked={false}
                onChange={() => console.log("Newsletter finished")}
              />
            </Stack>
          </SectionWrapper>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Notifications",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfileNotifications;
