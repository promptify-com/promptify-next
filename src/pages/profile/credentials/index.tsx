import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Box from "@mui/material/Box";
import Credentials from "@/components/profile2/Credentials";

function ProfileCredentials() {
  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="GPT credentials"
          description="Manage and update your account credentials to ensure the security and integrity of your account."
        >
          <Credentials />
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Credentials",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfileCredentials;
