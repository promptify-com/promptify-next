import { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { Templates } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import DataObject from "@mui/icons-material/DataObject";
import { Link } from "./Types";
import Api from "@mui/icons-material/Api";
import Instructions from "./Instructions";
import ExecutionExample from "./ExecutionExample";
import ApiAccess from "./ApiAccess";
import Feedback from "./Feedback";
import ClientOnly from "@/components/base/ClientOnly";
import useBrowser from "@/hooks/useBrowser";

const ScrollTabs: Link[] = [
  {
    name: "instructions",
    title: "Prompt Instructions",
    icon: <DataObject />,
  },
  {
    name: "example",
    title: "Example Content",
    icon: <ArticleOutlined />,
  },
  {
    name: "api",
    title: "API Access",
    icon: <Api />,
  },
  {
    name: "feedback",
    title: "Feedback",
    icon: <ForumOutlined />,
  },
];

interface Props {
  template: Templates;
  tabsFixed: boolean;
}

export default function ContentContainer({ template, tabsFixed }: Props) {
  const { isMobile } = useBrowser();
  const [selectedTab, setSelectedTab] = useState<Link>(ScrollTabs[0]);

  const handleTabChange = (tab: Link) => {
    setSelectedTab(tab);
    const section = document.getElementById(tab.name);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const sectionRatios = new Map();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          sectionRatios.set(entry.target.id, entry.intersectionRatio);

          let maxRatio = 0;
          let currentSectionId: string | null = null;

          sectionRatios.forEach((ratio, id) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              currentSectionId = id;
            }
          });

          if (currentSectionId) {
            const newSelectedTab = ScrollTabs.find(tab => tab.name === currentSectionId);
            if (newSelectedTab) setSelectedTab(newSelectedTab);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: Array.from({ length: 20 }, (_, i) => i * 0.05),
      },
    );

    ScrollTabs.forEach(tab => {
      const section = document.getElementById(tab.name);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box>
      <Box
        id={"sections_tabs"}
        sx={{
          position: { xs: "sticky", md: tabsFixed ? "sticky" : "relative" },
          zIndex: 999,
          top: 0,
          bgcolor: "surfaceContainerLowest",
          p: { xs: "8px 16px", md: "32px 36px" },
        }}
      >
        <Stack
          direction={"row"}
          gap={{ xs: 0.5, md: 2 }}
          sx={{
            width: "98%",
            minWidth: "fit-content",
            bgcolor: "surfaceContainerLow",
            p: { md: "4px" },
            borderRadius: "999px",
          }}
        >
          {ScrollTabs.map(tab => {
            const selected = selectedTab.name === tab.name;
            return (
              <Button
                key={tab.name}
                onClick={() => handleTabChange(tab)}
                startIcon={tab.icon}
                sx={{
                  flex: 1,
                  minWidth: "fit-content",
                  fontSize: 12,

                  p: "8px 16px",
                  color: selected ? "onSecondary" : "onSurface",
                  bgcolor: selected ? "secondary.main" : "transparent",
                  ":hover": {
                    bgcolor: selected ? "secondary.main" : "surfaceContainerHigh",
                  },
                }}
              >
                {(!isMobile || selected) && tab.title}
              </Button>
            );
          })}
        </Stack>
      </Box>
      <div id="instructions">
        <Instructions prompts={template.prompts || []} />
      </div>
      <div id="example">
        <ExecutionExample
          execution={template.example_execution}
          promptsData={template.prompts || []}
        />
      </div>
      <div id="api">
        <ApiAccess template={template} />
      </div>
      <div id="feedback">
        <ClientOnly>
          <Feedback />
        </ClientOnly>
      </div>
    </Box>
  );
}
