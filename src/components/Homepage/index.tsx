import { useEffect } from "react";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { AxiosResponse } from "axios";

import ClientOnly from "@/components/base/ClientOnly";
import { useAppDispatch } from "@/hooks/useStore";
import { userApi } from "@/core/api/user";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { getPathURL, saveToken } from "@/common/utils";
import { updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import { client } from "@/common/axios";
import CategoryCarousel from "@/components/common/CategoriesCarousel";
import Learn from "@/components/Homepage/GuestUserLayout/Learn";
import Testimonials from "@/components/Homepage/GuestUserLayout/Testimonials";
import SuggestionsSection from "@/components/Homepage/SuggestionsSection";
import type { Category } from "@/core/api/dto/templates";
import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import { TemplatesSection } from "../explorer/TemplatesSection";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function HomepageLayout({ categories }: { categories: Category[] }) {
  const path = getPathURL();
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();

  const { data: suggestedTemplates, isLoading: isSuggestedTemplateLoading } = useGetTemplatesSuggestedQuery(undefined);

  // TODO: move authentication logic to signin page instead
  const doPostLogin = async (response: AxiosResponse<IContinueWithSocialMediaResponse>) => {
    if (typeof response.data !== "object" || response.data === null) {
      console.error("incoming data for Microsoft authentication is not an object:", response.data);
      return;
    }

    const { token: _token } = response.data;

    if (!_token) {
      console.error("incoming token for Microsoft authentication is not present:", _token);
      return;
    }

    saveToken({ token: _token });
    const payload = await getCurrentUser(_token).unwrap();

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
    <ClientOnly>
      <Grid
        flexDirection="column"
        display={"flex"}
        gap={"56px"}
      >
        <Stack p={"8px 16px"}>
          <SuggestionsSection />
        </Stack>

        <Stack p={"8px 16px"}>
          <TemplatesSection
            templateLoading={isSuggestedTemplateLoading}
            templates={suggestedTemplates}
            title=" You may like this prompts:"
            type="popularTemplates"
          />
        </Stack>

        <CategoryCarousel
          categories={categories}
          userScrolled={false}
          href="/explore"
          gap={1}
        />
        <Learn />
        <Testimonials />
      </Grid>
    </ClientOnly>
  );
}

export default HomepageLayout;
