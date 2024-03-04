import { useState } from "react";
import Stack from "@mui/material/Stack";
import { Templates } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import DataObject from "@mui/icons-material/DataObject";
import { Link } from "./Types";
import Api from "@mui/icons-material/Api";
import { Typography } from "@mui/material";
import { theme } from "@/theme";

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

export default function ContentContainer({ template }: Props) {
  const [selectedTab, setSelectedTab] = useState<Link>(ScrollTabs[0]);

  const handleTabChange = (tab: Link) => {
    setSelectedTab(tab);
  };

  return (
    <Box
      height={"100svh"}
      overflow={"auto"}
    >
      <Box sx={{ position: "sticky", top: 0, bgcolor: "surfaceContainerLowest", p: "32px 36px" }}>
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
      <Stack
        gap={3}
        p={"48px"}
      >
        <Typography
          fontSize={32}
          fontWeight={400}
          color={"onSurface"}
          py={"16px"}
        >
          Prompt instructions:
        </Typography>
        <Stack gap={2}>
          {template.prompts?.map(prompt => (
            <Stack
              key={prompt.id}
              gap={2}
            >
              <Stack
                direction={"row"}
                gap={1}
              >
                <Typography
                  fontSize={16}
                  fontWeight={500}
                  color={"onSurface"}
                >
                  {prompt.title}
                </Typography>
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"secondary.main"}
                >
                  {prompt.engine.name}
                </Typography>
              </Stack>
              <Box
                sx={{
                  px: "8px",
                }}
              >
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                  sx={{
                    p: "16px 16px 16px 32px",
                    borderLeft: `1px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  {prompt.content}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
