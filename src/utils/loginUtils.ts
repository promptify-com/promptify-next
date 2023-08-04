import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import useSetUser from "@/hooks/useSetUser";
import { getPathURL, saveToken } from "@/common/utils";

export const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";
export const postLogin = (
  response: IContinueWithSocialMediaResponse | null
) => {
  const router = useRouter();
  const setUser = useSetUser();

  if (!response) return;
  if (response?.created) {
    setUser(response);
    router.push("/signup");
  } else {
    const path = getPathURL();
    if (path) {
      router.push(path);
    }
  }
};

export const doPostLogin = (
  r: AxiosResponse<IContinueWithSocialMediaResponse>,
  savedToken: string | null | undefined
) => {
  const { token } = r.data;
  if (!!savedToken && token !== savedToken) {
    const router = useRouter();
    const path = getPathURL();
    if (path) {
      router.push(path);
      localStorage.setItem("from", "alert");
    }
  } else {
    const setUser = useSetUser();
    setUser(r.data);
    saveToken(r.data);
    postLogin(r.data);
  }
};
