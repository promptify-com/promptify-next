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

interface TemplateDesktopProps {
  hashedExecution: TemplatesExecutions | null;
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage, hashedExecution }: TemplateDesktopProps) {
  const isTemplatePublished = template?.status === "PUBLISHED";

  const breadcrumbs = [
    <Link
      key="0"
      href="/explore"
      sx={breadcrumbStyle}
    >
      All Templates
    </Link>,
    <Link
      key="1"
      href={`/explore/${template.category.slug}`}
      sx={breadcrumbStyle}
    >
      {template.category.name}
    </Link>,
    <Link
      key="2"
      sx={{
        ...breadcrumbStyle,
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <CardMedia
        sx={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
        component="img"
        image={template.thumbnail}
        alt={template.title}
      />
      {template.title}
    </Link>,
  ];

  return (
    <Box>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          p: "8px 16px",
        }}
      >
        <Breadcrumbs
          separator={<ArrowBackIosNew sx={{ fontSize: 16, color: alpha(theme.palette.text.secondary, 0.45) }} />}
        >
          {breadcrumbs}
        </Breadcrumbs>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
          fontSize={13}
        >
          <Button
            sx={{
              p: "0",
            }}
          >
            <FavoriteIcon
              style={{
                sx: {
                  color: "secondary.main",
                  fontSize: 13,
                  gap: 1,
                  svg: {
                    width: 20,
                    height: 20,
                  },
                },
              }}
            />
          </Button>
          <Button
            sx={{
              p: "8px 11px",
              color: "secondary.main",
              fontSize: 13,
              gap: 1,
            }}
          >
            <Tune sx={{ fontSize: 20 }} />
            Customize
          </Button>
          <Button
            sx={{
              p: "8px 11px",
              color: "secondary.main",
              fontSize: 13,
              gap: 1,
            }}
          >
            by {template.created_by.first_name || "Promptify"}
            <Avatar
              src={template.created_by.avatar}
              alt={template.created_by.username}
              sx={{ width: 30, height: 30 }}
            />
          </Button>
        </Stack>
      </Stack>
      <Grid
        mt={0}
        gap={"8px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
        height={"calc(100svh - 90px)"}
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
          borderRadius={"16px"}
          position={"sticky"}
          top={0}
          zIndex={100}
          height={"100%"}
          overflow={"auto"}
          sx={{
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
          <DetailsCard templateData={template} />
          <Stack flex={1}>
            <Box flex={1}>
              <Accordion
                key={template?.id}
                sx={{
                  mb: -1,
                  boxShadow: "none",
                  borderRadius: "16px",
                  bgcolor: "surface.1",
                  overflow: "hidden",
                  ".MuiAccordionDetails-root": {
                    p: "0",
                  },
                  ".MuiAccordionSummary-root": {
                    minHeight: "48px",
                    ":hover": {
                      cursor: isTemplatePublished ? "auto" : "pointer",
                      opacity: 0.8,
                      svg: {
                        color: "primary.main",
                      },
                    },
                  },
                  ".MuiAccordionSummary-content": {
                    m: 0,
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "primary.main",
                    }}
                  >
                    More about template
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Details templateData={template} />
                </AccordionDetails>
              </Accordion>
              <GeneratorForm
                templateData={template}
                onError={setErrorMessage}
              />
            </Box>
          </Stack>
        </Stack>

        <Grid
          flex={1}
          borderRadius={"16px"}
          width={"62%"}
          display={"block"}
        >
          <Grid mr={1}>
            <Display
              templateData={template}
              onError={setErrorMessage}
              hashedExecution={hashedExecution}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
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
