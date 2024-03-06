import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import Header from "@/components/Prompt/Common/Header";
import { Templates } from "@/core/api/dto/templates";
import TemplateDetails from "./TemplateDetails";
import Box from "@mui/material/Box";
import Image from "@/components/design-system/Image";
import ContentContainer from "./ContentContainer";
import { useEffect, useRef, useState } from "react";
import { theme } from "../../theme";

interface Props {
  template: Templates;
  popup?: boolean;
}

function TemplatePage({ template, popup }: Props) {
  const { isMobile } = useBrowser();
  const [tabsFixed, setTabsFixed] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const topThreshold = popup ? 24 : 92;

  useEffect(() => {
    const handleScroll = () => {
      const tabsElement = document.getElementById("sections_tabs");
      if (tabsElement) {
        const atTop = tabsElement.getBoundingClientRect().top <= topThreshold;
        console.log(tabsElement.getBoundingClientRect().top);
        setTabsFixed(atTop);
      }
    };

    handleScroll();

    tabsRef.current?.addEventListener("scroll", handleScroll);
    return () => tabsRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          pr: "4px",
          "&::-webkit-scrollbar": {
            width: { xs: "4px", md: "6px" },
            p: 1,
          },
          ":hover&::-webkit-scrollbar-thumb": {
            backgroundColor: "surface.5",
            outline: "1px solid surface.1",
            borderRadius: "10px",
          },
        }}
      >
        <Stack>
          {!isMobile && <Header template={template} />}
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
  );
}

export default TemplatePage;
