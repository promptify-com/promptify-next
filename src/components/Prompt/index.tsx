import { useState } from "react";
import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import Header from "@/components/Prompt/Common/Header";
import { Templates } from "@/core/api/dto/templates";
import TemplateDetails from "./Common/Sidebar/TemplateDetails";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import DataObject from "@mui/icons-material/DataObject";
import Image from "@/components/design-system/Image";
import { Link } from "./Types";
import Api from "@mui/icons-material/Api";

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
}

function TemplatePage({ template }: Props) {
  const { isMobile } = useBrowser();

  const [selectedTab, setSelectedTab] = useState<Link>(ScrollTabs[0]);

  const handleTabChange = (tab: Link) => {
    setSelectedTab(tab);
  };

  return (
    <Stack
      direction={"row"}
      gap={4}
      width={{ md: "90%" }}
      m={"auto"}
      bgcolor={"surface.1"}
    >
      <Stack flex={4}>
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
        <Box p={"32px 36px"}>
          <Stack
            direction={"row"}
            gap={2}
            sx={{
              bgcolor: "surfaceContainerLow",
              p: "4px",
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
                    p: "8px 16px",
                    color: selected ? "onSecondary" : "onSurface",
                    bgcolor: selected ? "secondary.main" : "transparent",
                    ":hover": {
                      bgcolor: selected ? "secondary.main" : "surfaceContainerHigh",
                    },
                  }}
                >
                  {tab.title}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Stack>
      <Box flex={2}>
        <TemplateDetails template={template} />
      </Box>
    </Stack>
  );
}

export default TemplatePage;
