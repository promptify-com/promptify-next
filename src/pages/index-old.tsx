import { useEffect } from "react";
import type { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { client } from "@/common/axios";
import { Layout } from "@/layout";
import { userApi } from "@/core/api/user";
import { getPathURL, saveToken } from "@/common/utils";
import { updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import Landing from "@/components/Landing";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function HomePage() {
  const path = getPathURL();
  const dispatch = useDispatch();
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();

  // TODO: move authentication logic to signin page instead
  const doPostLogin = async (response: AxiosResponse<IContinueWithSocialMediaResponse>) => {
    if (typeof response.data !== "object" || response.data === null) {
      console.error("incoming data for Microsoft authentication is not an object:", response.data);
      return;
    }

    const { token } = response.data;

    if (!token) {
      console.error("incoming token for Microsoft authentication is not present:", token);
      return;
    }

    saveToken({ token });
    const payload = await getCurrentUser(token).unwrap();

    dispatch(updateUser(payload));
    redirectToPath(path || "/");
  };

  // TODO: move authentication logic to signin page instead
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get("code");

    if (!!authorizationCode) {
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "microsoft",
          code: authorizationCode,
        })
        .then((response: AxiosResponse<IContinueWithSocialMediaResponse>) => {
          doPostLogin(response);
        })
        .catch(reason => {
          console.warn("Could not authenticate via Microsoft:", reason);
        });
    }
  }, []);

  return (
    <Layout>
      <Landing />
    </Layout>
  );
}

export const getServerSideProps = () => {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
};

export default HomePage;
