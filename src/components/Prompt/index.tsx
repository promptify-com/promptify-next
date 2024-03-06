import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import Header from "@/components/Prompt/Common/Header";
import { Templates } from "@/core/api/dto/templates";
import TemplateDetails from "./TemplateDetails";
import Box from "@mui/material/Box";
import Image from "@/components/design-system/Image";
import ContentContainer from "./ContentContainer";
import { useRef, useEffect, useState } from "react";
import { type Palette, ThemeProvider, createTheme, useTheme } from "@mui/material";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { isValidUserFn } from "@/core/store/userSlice";
import { updatePopupTemplate, updateTemplateData } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useViewTemplateMutation } from "@/core/api/templates";

interface IMUDynamicColorsThemeColor {
  light: {
    primary: string;
    secondary: string;
    error: string;
    background: string;
    surface: string;
    surfaceVariant: string;
  };
}

interface Props {
  template: Templates;
  popup?: boolean;
}

function TemplatePage({ template, popup }: Props) {
  const { isMobile } = useBrowser();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const savedTemplateId = useAppSelector(state => state.template.id);
  const [updateViewTemplate] = useViewTemplateMutation();

  const [tabsFixed, setTabsFixed] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const topThreshold = popup ? 24 : 92;
  const [palette, setPalette] = useState(theme.palette);

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
    if (!template) {
      return;
    }

    if (template.thumbnail) {
      fetchDynamicColors();
    }

    if (!savedTemplateId || savedTemplateId !== template.id) {
      dispatch(
        updateTemplateData({
          id: template.id,
          is_favorite: template.is_favorite,
          is_liked: template.is_liked,
          likes: template.favorites_count,
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
        template: null,
      }),
    );
  };

  const fetchDynamicColors = () => {
    //@ts-expect-error unfound-new-type
    materialDynamicColors(template.thumbnail)
      .then((imgPalette: IMUDynamicColorsThemeColor) => {
        const newPalette: Palette = {
          ...theme.palette,
          ...imgPalette.light,
          primary: {
            ...theme.palette.primary,
            main: imgPalette.light.primary,
          },
          secondary: {
            ...theme.palette.secondary,
            main: imgPalette.light.secondary,
          },
          error: {
            ...theme.palette.secondary,
            main: imgPalette.light.error,
          },
          background: {
            ...theme.palette.background,
            default: imgPalette.light.background,
          },
          surface: {
            1: imgPalette.light.surface,
            2: mix(0.3, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            3: mix(0.6, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            4: mix(0.8, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            5: imgPalette.light.surfaceVariant,
          },
        };
        setPalette(newPalette);
      })
      .catch(() => {
        console.warn("Error fetching dynamic colors");
      });
  };
  const dynamicTheme = createTheme({ ...theme, palette });

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Stack
        direction={"row"}
        gap={4}
        height={{
          xs: `calc(100svh - ${popup ? "24px" : theme.custom.headerHeight.xs})`,
          md: `calc(100svh - ${popup ? "24px" : theme.custom.headerHeight.md})`,
        }}
        px={"32px"}
        bgcolor={"surfaceContainerLowest"}
      >
        <Box
          ref={tabsRef}
          flex={4}
          height={{
            xs: `calc(100% - ${popup ? "24px" : 0})`,
            md: `calc(100% - ${popup ? "24px" : 0})`,
          }}
          overflow={"auto"}
          sx={{
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <Stack>
            {!isMobile && (
              <Header
                template={template}
                close={closeTemplatePopup}
              />
            )}
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
            <ContentContainer
              template={template}
              tabsFixed={tabsFixed}
            />
          </Stack>
        </Box>
        <Box flex={2}>
          <TemplateDetails template={template} />
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default TemplatePage;
