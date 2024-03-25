import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { Connections, Home, Identity, TemplatesManager } from "@/components/profile";
import { useAppSelector } from "@/hooks/useStore";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import EditProfile from "@/components/profile/EditProfile";
import Credentials from "@/components/profile/Credentials";
import { SEO_DESCRIPTION } from "@/common/constants";

const Profile = () => {
  const isEditMode = useAppSelector(state => state.profile.showEditMode);
  const currentUser = useAppSelector(state => state.user.currentUser);

  return <Protected>{isEditMode ? <EditProfile /> : <Layout>Welcome</Layout>}</Protected>;
};

export async function getServerSideProps() {
  return {
    props: {
      title: "My Account",
      description: SEO_DESCRIPTION,
    },
  };
}

export default Profile;
