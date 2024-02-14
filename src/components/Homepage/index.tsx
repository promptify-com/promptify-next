import { useGetTemplatesSuggestedQuery } from "@/core/api/templates";
import { Category } from "@/core/api/dto/templates";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import ClientOnly from "@/components/base/ClientOnly";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useGetLatestExecutedTemplatesQuery } from "@/core/api/executions";
import { userApi } from "@/core/api/user";
import { AxiosResponse } from "axios";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { getPathURL, saveToken } from "@/common/utils";
import { updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import { client } from "@/common/axios";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function HomepageLayout({ categories }: { categories: Category[] }) {
  const path = getPathURL();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();
  const { data: myLatestExecutions, isLoading: isMyLatestExecutionsLoading } =
    useGetLatestExecutedTemplatesQuery(undefined);
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
        <Grid
          sx={{
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: { xs: "30px", sm: "48px" },
              lineHeight: { xs: "30px", md: "56px" },
              color: "#1D2028",
              marginLeft: { xs: "0px", sm: "0px" },
            }}
          >
            Welcome, {currentUser?.username}
          </Typography>
        </Grid>

        <TemplatesSection
          templateLoading={isMyLatestExecutionsLoading}
          templates={myLatestExecutions}
          title="Your Latest Templates:"
          type="myLatestExecutions"
        />
        <TemplatesSection
          templateLoading={isSuggestedTemplateLoading}
          templates={suggestedTemplates}
          title=" You may like these prompt templates:"
          type="suggestedTemplates"
        />
        <CategoriesSection
          categories={categories}
          isLoading={false}
          displayTitle
        />
      </Grid>
    </ClientOnly>
  );
}

export default HomepageLayout;
