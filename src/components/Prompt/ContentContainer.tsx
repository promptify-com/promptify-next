import { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { Templates } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import DataObject from "@mui/icons-material/DataObject";
import Instructions from "./Instructions";
import ExecutionExample from "./ExecutionExample";
import { Link } from "./Types";
import Api from "@mui/icons-material/Api";
import useBrowser from "@/hooks/useBrowser";
import lazy from "next/dynamic";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import ApiAccessPlaceholder from "./ApiAccessPlaceholder";
import PromptFeedbackPlaceholder from "./PromptFeedbackPlaceholder";

const ApiAccess = lazy(() => import("./ApiAccess"), { ssr: false });
const Feedback = lazy(() => import("./Feedback"), { ssr: false });
const Footer = lazy(() => import("../Footer"), { ssr: false });

const ScrollTabs: Link[] = [
  { name: "instructions", title: "Prompt Instructions", icon: <DataObject /> },
  { name: "example", title: "Example Content", icon: <ArticleOutlined /> },
  { name: "api", title: "API Access", icon: <Api /> },
  { name: "feedback", title: "Feedback", icon: <ForumOutlined /> },
];

interface Props {
  template: Templates;
  tabsFixed: boolean;
}

export default function ContentContainer({ template, tabsFixed }: Props) {
  const { isMobile } = useBrowser();
  const [selectedTab, setSelectedTab] = useState<Link>(ScrollTabs[0]);
  const [isScrolling, setIsScrolling] = useState(false);

  const apiAccessContainerRef = useRef<HTMLDivElement | null>(null);
  const feedbackContainerRef = useRef<HTMLDivElement | null>(null);

  const activeSectionRef = useRef<string | null>(null);

  const observers = {
    apiAccessObserver: useIntersectionObserver(apiAccessContainerRef, { threshold: 0.5 }),
    feedbackObserver: useIntersectionObserver(feedbackContainerRef, { threshold: 0.5 }),
  };

  const handleTabChange = (tab: Link) => {
    setIsScrolling(true);
    setSelectedTab(tab);
    activeSectionRef.current = tab.name;
    const section = document.getElementById(tab.name);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      setIsScrolling(false);
      activeSectionRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    const sectionRatios = new Map();
    if (isScrolling) return;
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
          if (currentSectionId && currentSectionId !== activeSectionRef.current && !isScrolling) {
            setIsScrolling(false);
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
      if (section) {
        observer.observe(section);
        setIsScrolling(false);
      }
    });

    return () => observer.disconnect();
  }, [isScrolling]);

  return (
    <Box>
      <Box
        id={"sections_tabs"}
        sx={{
          position: { xs: "sticky", md: tabsFixed ? "sticky" : "relative" },
          zIndex: 999,
          top: { xs: 0, md: 0 },
          bgcolor: "surfaceContainerLowest",
          p: { xs: "32px 16px", md: "32px 36px" },
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
                aria-label={tab.title}
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
      <Box
        id="api"
        ref={apiAccessContainerRef}
        sx={{
          ["@media (min-width: 768px) and (max-width: 1024px)"]: {
            minHeight: "50px",
          },
          transition: "all 0.5s ease-in-out",
        }}
      >
        {observers.apiAccessObserver?.isIntersecting ? <ApiAccess template={template} /> : <ApiAccessPlaceholder />}
      </Box>
      <Box
        id="feedback"
        ref={feedbackContainerRef}
        sx={{
          ["@media (min-width: 768px) and (max-width: 1024px)"]: {
            minHeight: "50px",
          },
          transition: "all 0.5s ease-in-out",
        }}
      >
        {observers.feedbackObserver?.isIntersecting ? <Feedback /> : <PromptFeedbackPlaceholder />}
      </Box>
      {isMobile && <Footer />}
    </Box>
  );
}
