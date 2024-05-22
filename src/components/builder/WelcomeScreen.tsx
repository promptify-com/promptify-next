import { useEffect } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CreateBuilderCard from "@/components/builder/CreateBuilderCard";
import TemplateSuggestionPlaceholder from "@/components/placeholders/TemplateSuggestionPlaceholder";
import type { TemplatesWithPagination } from "@/core/api/dto/templates";
import type { ICreateBuilderLink } from "@/components/builder/Types";
import TemplateCard from "@/components/common/TemplateCard";
import { useLazyGetMyTemplatesQuery } from "@/core/api/templates";

const createPageLinks = [
  {
    label: "New chained prompt",
    href: "/prompt-builder/create?editor",
    type: "NEW",
  },
  {
    label: "New GPT",
    href: "#",
    type: "GPT",
  },
] satisfies ICreateBuilderLink[];

export default function WelcomeScreen() {
  const [triggerGetMyTemplates, { data: templates, isLoading }] = useLazyGetMyTemplatesQuery();

  useEffect(() => {
    const isDesktop = window.innerWidth >= 900;

    if (isDesktop) {
      const fetchData = async () => {
        try {
          triggerGetMyTemplates({ ordering: "-created_at", limit: 1, status: "draft" });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }

    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 900;
      if (newIsDesktop !== isDesktop) {
        window.location.reload();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Stack
      mt={"72px"}
      direction={"column"}
      gap={"48px"}
      justifyContent={"center"}
      alignItems={"center"}
      width={{ md: "100%" }}
      mx={{ xs: "16px", md: "auto" }}
      mb={{ xs: "72px", md: "0" }}
    >
      <Stack
        width={"100%"}
        gap={2}
        justifyContent={"center"}
        alignItems={{ xs: "start", md: "center" }}
        textAlign={{ xs: "start", md: "center" }}
      >
        <Typography
          fontSize={{ xs: 28, md: 48 }}
          fontWeight={400}
          lineHeight={"57.6px"}
          letterSpacing={"0.17px"}
        >
          Prompt Editor
        </Typography>
        <Typography
          fontSize={16}
          fontWeight={400}
          lineHeight={"25.6px"}
          letterSpacing={"0.17px"}
        >
          Structure your prompts for a productive and more deterministic AI. Your chained <br /> prompts will guide AI
          content creation with focus and intent.
        </Typography>
        <Link
          href={"https://blog.promptify.com/"}
          target={"_blank"}
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          aria-label="Learn more about Promptify blog"
        >
          <Button variant="contained">Learn more</Button>
        </Link>
      </Stack>
      <Stack
        gap={"72px"}
        width={{ xs: "100%", sm: "107svh", md: "80%" }}
        height={{ xs: "auto", sm: "100svh", md: "auto" }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent={"center"}
          gap={3}
        >
          {createPageLinks.map(link => (
            <CreateBuilderCard
              key={link.type}
              link={link}
            />
          ))}
        </Stack>

        <Stack pb={2}>
          {isLoading && <TemplateSuggestionPlaceholder />}

          {(templates as TemplatesWithPagination)?.results.length > 0 && !isLoading && (
            <Stack
              gap={3}
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography
                fontSize={16}
                fontWeight={500}
                lineHeight={"19.2px"}
                letterSpacing={"0.17px"}
              >
                Continue editing
              </Typography>
              <TemplateCard
                template={(templates as TemplatesWithPagination).results[0]}
                isEditor
              />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
