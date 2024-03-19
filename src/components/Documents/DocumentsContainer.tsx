import { Box, Card, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { Execution, ExecutionWithTemplate, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import Link from "next/link";
import useTimestampConverter from "@/hooks/useTimestampConverter";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
}

export default function DocumentsContainer({ templates }: Props) {
  const { convertedTimestamp } = useTimestampConverter();

  const executions = useMemo(() => {
    // Calculate all executions from templates and add template information
    const allExecutions: ExecutionWithTemplate[] = [];
    templates?.forEach(template => {
      const templateInfo = {
        title: template.title,
        thumbnail: template.thumbnail,
        slug: template.slug,
      };
      const executionsWithTemplate = template.executions.map((execution: Execution) => ({
        ...execution,
        template: templateInfo,
      }));
      allExecutions.push(...executionsWithTemplate);
    });

    return allExecutions;
  }, [templates]);

  return (
    <Stack gap={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        p={"8px 16px"}
      >
        <Typography
          fontSize={32}
          fontWeight={400}
        >
          All documents
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        rowGap={3}
      >
        {executions.map(execution => (
          <Card
            key={execution.id}
            component={Link}
            href={`/prompt/${execution.template.slug}?hash=${execution.hash}`}
            elevation={0}
            sx={{
              width: "368px",
              height: "315px",
              p: "8px",
              borderRadius: "16px",
              textDecoration: "none",
              bgcolor: "surfaceContainerLowest",
              transition: "background-color 0.3s ease",
              ":hover": {
                bgcolor: "surfaceContainerLow",
              },
            }}
          >
            <Box
              sx={{
                p: "16px",
                borderRadius: "16px",
                bgcolor: "surfaceContainer",
              }}
            >
              <Stack
                alignItems={"flex-start"}
                gap={2}
                sx={{
                  height: "150px",
                  width: "calc(85% - 64px)",
                  m: "auto",
                  overflow: "hidden",
                  bgcolor: "surfaceContainerLowest",
                  p: "32px 32px 24px 32px",
                  borderRadius: "4px",
                }}
              >
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  {execution.title}
                </Typography>
                <Typography
                  fontSize={10}
                  fontWeight={300}
                  color={"onSurface"}
                >
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto iste exercitationem impedit, fugiat
                  atque at blanditiis mollitia placeat eius expedita rem consequatur officiis itaque. Ducimus odit culpa
                  porro vero, error excepturi dolores est aliquam sapiente minus voluptatibus natus dolorem amet eos! Id
                  nulla, nesciunt consequatur adipisci deleniti numquam neque quasi.
                </Typography>
              </Stack>
            </Box>
            <Box p={"8px"}>
              <Typography
                fontSize={16}
                fontWeight={500}
                color={"onSurface"}
                sx={oneLineStyle}
              >
                {execution.title}
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={400}
                color={"secondary.light"}
                sx={oneLineStyle}
              >
                {execution.template.title}
              </Typography>
              <Typography
                fontSize={12}
                fontWeight={400}
                color={"secondary.light"}
                sx={oneLineStyle}
              >
                {convertedTimestamp(execution.created_at)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

const oneLineStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};
