import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import Header from "@/components/Prompt/Common/Header";
import { Templates } from "@/core/api/dto/templates";
import TemplateDetails from "./TemplateDetails";
import Box from "@mui/material/Box";
import Image from "@/components/design-system/Image";
import ContentContainer from "./ContentContainer";
import { useRef, useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { isValidUserFn } from "@/core/store/userSlice";
import { updatePopupTemplate, updateTemplateData } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useViewTemplateMutation } from "@/core/api/templates";
import { redirectToPath } from "@/common/helpers";
import { useDynamicColors } from "@/hooks/useDynamicColors";

interface Props {
  template: Templates;
  popup?: boolean;
}

function TemplatePage({ template, popup }: Props) {
  if (!template) {
    // @ts-expect-error incomplete-template-object
    template = {
      category: {},
      prompts: [],
      created_by: {},
      created_at: new Date(),
    } as Templates;
  }

  const { isMobile } = useBrowser();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const savedTemplateId = useAppSelector(state => state.template.id);
  const [updateViewTemplate] = useViewTemplateMutation();

  const [tabsFixed, setTabsFixed] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const topThreshold = popup ? 24 : 92;

  const dynamicTheme = useDynamicColors(template, template.thumbnail);

  useEffect(() => {
    const handleScroll = () => {
      const tabsElement = document.getElementById("sections_tabs");
      if (tabsElement) {
        const atTop = tabsElement.getBoundingClientRect().top <= topThreshold;
        setTabsFixed(atTop);
      }
    };

    handleScroll();

    tabsRef.current?.addEventListener("scroll", handleScroll);
    return () => tabsRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!template || !Object.keys(template).length) {
      redirectToPath(window.location.pathname ?? "/");
      return;
    }

    if (!savedTemplateId || savedTemplateId !== template.id) {
      dispatch(
        updateTemplateData({
          id: template.id,
          is_favorite: template.is_favorite,
          is_liked: template.is_liked,
          likes: template.likes,
        }),
      );
    }

    if (isValidUser) {
      updateViewTemplate(template.id);
    }
  }, [template]);

  const closeTemplatePopup = () => {
    dispatch(
      updatePopupTemplate({
        data: null,
      }),
    );
  };

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Stack
        direction={{ md: "row" }}
        height={{
          xs: `calc(100svh - ${popup ? "24px" : theme.custom.headerHeight.xs})`,
          md: `calc(100svh - ${popup ? "24px" : theme.custom.headerHeight.md})`,
        }}
        sx={{
          overflow: { xs: "auto", md: "unset" },
          mt: { xs: theme.custom.headerHeight.xs, md: 0 },
          px: { md: "32px" },
        }}
      >
        <Box
          ref={tabsRef}
          flex={4}
          order={{ xs: 1, md: 0 }}
          height={{
            md: `calc(100% - ${popup ? "24px" : "0px"})`,
          }}
          sx={{
            pr: { md: "32px" },
            overflow: { md: "auto" },
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <Stack>
            {!isMobile && (
              <Stack
                sx={{
                  p: "24px 48px",
                }}
              >
                <Header
                  template={template}
                  close={closeTemplatePopup}
                />
              </Stack>
            )}
            {!isMobile && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: isMobile ? "408px" : "446px",
                  borderRadius: "24px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
                  alt={template.title?.slice(0, 1) ?? "P"}
                  priority={true}
                  fill
                  sizes="(max-width: 900px) 253px, 446px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
            <ContentContainer
              template={template}
              tabsFixed={tabsFixed}
            />
          </Stack>
        </Box>
        <Box
          flex={2}
          order={0}
        >
          <TemplateDetails
            template={template}
            close={closeTemplatePopup}
          />
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default TemplatePage;
