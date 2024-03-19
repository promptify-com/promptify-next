import useTimestampConverter from "@/hooks/useTimestampConverter";
import Card from "@mui/material/Card";
import { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface Props {
  execution: ExecutionWithTemplate;
}

export default function CardDocument({ execution }: Props) {
  const { convertedTimestamp } = useTimestampConverter();

  return (
    <Card
      key={execution.id}
      component={Link}
      href={`/prompt/${execution.template.slug}?hash=${execution.hash}`}
      elevation={0}
      sx={{
        width: "368px",
        height: "315px",
        flexGrow: 1,
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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto iste exercitationem impedit, fugiat atque at
            blanditiis mollitia placeat eius expedita rem consequatur officiis itaque. Ducimus odit culpa porro vero,
            error excepturi dolores est aliquam sapiente minus voluptatibus natus dolorem amet eos! Id nulla, nesciunt
            consequatur adipisci deleniti numquam neque quasi.
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
  );
}

const oneLineStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};
