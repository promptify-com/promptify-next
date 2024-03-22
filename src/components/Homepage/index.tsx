import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { AxiosResponse } from "axios";
import Typography from "@mui/material/Typography";

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
import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import CardTemplate from "@/components/common/cards/CardTemplate";
import AdsBox from "@/components/Homepage/GuestUserLayout/AdsBox";
import type { Category } from "@/core/api/dto/templates";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function HomepageLayout({ categories }: { categories: Category[] }) {
  const path = getPathURL();
  const dispatch = useAppDispatch();

  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();

  const { data: suggestedTemplates } = useGetTemplatesSuggestedQuery(undefined);

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
        mx={{ md: "50px" }}
      >
        <Stack>
          <SuggestionsSection />
        </Stack>

        <Stack>
          <Typography
            fontSize={{ xs: 19, md: 32 }}
            fontWeight={400}
            lineHeight={"38.8px"}
            letterSpacing={"0.17px"}
            color={"onSurface"}
          >
            You may like this prompts:
          </Typography>
          <Grid
            container
            gap={{ xs: 1, sm: 0 }}
          >
            <Grid
              item
              ml={{ md: -2 }}
              xs={12}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              mb={{ xs: 2, md: 0 }}
            >
              <AdsBox />
            </Grid>
            <>
              {suggestedTemplates?.map(template => (
                <Grid
                  key={template.id}
                  item
                  sm={4}
                  md={4}
                  lg={3}
                  xl={2}
                >
                  <CardTemplate
                    template={template}
                    vertical
                  />
                </Grid>
              ))}
            </>
          </Grid>
        </Stack>

        <Stack mr={"16px"}>
          <CategoryCarousel
            categories={categories}
            userScrolled={false}
            href="/explore"
            gap={1}
            explore
          />
        </Stack>

        <Learn />
        <Testimonials />
      </Grid>
    </ClientOnly>
  );
}

export default HomepageLayout;
