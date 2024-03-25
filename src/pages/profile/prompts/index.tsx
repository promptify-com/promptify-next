import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";

const ProfilePrompts = () => {
  return (
    <Protected>
      <Layout>Prompts page</Layout>
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
