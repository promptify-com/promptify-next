import { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { getPathURL, saveToken } from "@/common/utils";
import { updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";
import { client } from "@/common/axios";
import { useAppDispatch } from "@/hooks/useStore";
import { userApi } from "@/core/api/user";
import useBrowser from "@/hooks/useBrowser";
import Landing from "@/components/Homepage/GuestUserLayout/Landing";
import CategoryCarousel from "@/components/common/CategoriesCarousel";
import Services from "@/components/Homepage/GuestUserLayout/Services";
import Learn from "@/components/Homepage/GuestUserLayout/Learn";
import Testimonials from "@/components/Homepage/GuestUserLayout/Testimonials";
import HomepageTemplates from "@/components/Homepage/HomepageTemplates";
import type { Category } from "@/core/api/dto/templates";
import type { AxiosResponse } from "axios";
import type { IContinueWithSocialMediaResponse } from "@/common/types";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const path = getPathURL();

  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();

  const templateContainerRef = useRef<HTMLDivElement | null>(null);
  const learnContainerRef = useRef<HTMLDivElement | null>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const [loadCarousel, setLoadCarousel] = useState(!isMobile); // Initially load if not mobile

  const carouselObserver = useIntersectionObserver(carouselContainerRef, {});
  const observers = {
    templatesObserver: useIntersectionObserver(templateContainerRef, {}),
    learnObserver: useIntersectionObserver(learnContainerRef, {}),
    testimonialsObserver: useIntersectionObserver(testimonialsContainerRef, {}),
  };
  const { data: popularTemplates, isLoading } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 30,
      status: "published",
    },
    {
      skip: !observers.templatesObserver?.isIntersecting,
    },
  );
  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  useEffect(() => {
    if (isMobile && carouselObserver?.isIntersecting) {
      setLoadCarousel(true);
    }
  }, [carouselObserver?.isIntersecting]);

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

  const showLearn = observers.learnObserver?.isIntersecting;
  const showTestimonials = observers.learnObserver?.isIntersecting;

  return (
    <Stack
      mx={{ md: "50px" }}
      data-cy="guest-main-container"
    >
      <Landing />
      <Box ref={carouselContainerRef}>
        {loadCarousel && (
          <CategoryCarousel
            categories={_categories}
            href="/explore"
            autoPlay
            explore
          />
        )}
      </Box>

      <Services />
      <Stack
        ref={templateContainerRef}
        py={{ xs: "30px", md: "48px" }}
        gap={3}
      >
        <HomepageTemplates
          title="Most popular:"
          templates={popularTemplates?.results || []}
          templatesLoading={isLoading}
          showAdsBox
        />
      </Stack>
      <Box ref={learnContainerRef}>{showLearn && <Learn />}</Box>
      <Box ref={testimonialsContainerRef}>{showTestimonials && <Testimonials />}</Box>
    </Stack>
  );
}

export default GuestUserLayout;
