import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import { Connections } from "@/components/profile2/Connections";
import Box from "@mui/material/Box";

function ProfileSocialAccounts() {
  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="My accounts"
          description="Enhance your experience and unlock personalized features by connecting your accounts. By linking your accounts, our app can securely access relevant information to tailor recommendations and provide a more personalized user experience."
        >
          <Box px={"16px"}>
            <Connections />
          </Box>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "My Prompts",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfileSocialAccounts;
