import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";

const ProfilePrompts = () => {
  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="My prompts"
          description=" Here, you can customize your prompt templates"
        >
          Prompt
        </ContentWrapper>
      </Layout>
    </Protected>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "My Prompts",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfilePrompts;
