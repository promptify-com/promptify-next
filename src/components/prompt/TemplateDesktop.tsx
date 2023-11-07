import { type Dispatch, type SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DetailsCard } from "./DetailsCard";
import { Details } from "./Details";
import { GeneratorForm } from "./GeneratorForm";
import { Display } from "./Display";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { Avatar, Breadcrumbs, Button, CardMedia, Link, alpha } from "@mui/material";
import { ArrowBackIosNew, Tune } from "@mui/icons-material";
import { theme } from "@/theme";
import FavoriteIcon from "./FavoriteIcon";
import ClientOnly from "../base/ClientOnly";
import ChatMode from "./generate/ChatBox";
import Header from "./Header";

interface TemplateDesktopProps {
  hashedExecution: TemplatesExecutions | null;
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage, hashedExecution }: TemplateDesktopProps) {
  const isTemplatePublished = template?.status === "PUBLISHED";

  return (
    <Stack gap={"1px"}>
      <Header template={template} />
      <Grid
        mt={0}
        gap={"1px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
        height={"calc(100svh - 90px)"}
        bgcolor={"surface.1"}
        width={"100%"}
        position={"relative"}
        overflow={"auto"}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
            p: 1,
            bgcolor: "surface.1",
          },
          "&::-webkit-scrollbar-track": {
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "surface.1",
            outline: "1px solid surface.1",
            borderRadius: "10px",
          },
        }}
      >
        <Stack
          maxWidth={"430px"}
          width={"38%"}
          position={"sticky"}
          top={0}
          zIndex={100}
          height={"100%"}
          overflow={"auto"}
          borderRight={"1px solid"}
          sx={{
            borderColor: "surface.3",
            "&::-webkit-scrollbar": {
              width: "6px",
              p: 1,
              backgroundColor: "surface.5",
            },
            "&::-webkit-scrollbar-track": {
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "surface.1",
              outline: "1px solid surface.1",
              borderRadius: "10px",
            },
          }}
        >
          <ClientOnly>
            <ChatMode
              onError={setErrorMessage}
              template={template}
            />
          </ClientOnly>
        </Stack>

        <Grid
          flex={1}
          width={"62%"}
          display={"block"}
        >
          <Display
            templateData={template}
            onError={setErrorMessage}
            hashedExecution={hashedExecution}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

const breadcrumbStyle = {
  color: alpha(theme.palette.text.secondary, 0.45),
  fontSize: 13,
  p: "8px 11px",
  ":hover": {
    color: theme.palette.text.secondary,
  },
};
