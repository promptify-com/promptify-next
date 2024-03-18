import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import { useRouter } from "next/router";
import Image from "@/components/design-system/Image";
import useTruncate from "@/hooks/useTruncate";
import { isDesktopViewPort, stripTags } from "@/common/helpers";
import { useAppDispatch } from "@/hooks/useStore";
import Link from "next/link";

type CardDocumentTemplateProps = {
  template: TemplateExecutionsDisplay;
};

function CardDocumentTemplate({ template }: CardDocumentTemplateProps) {
  const isDesktop = isDesktopViewPort();

  return (
    <Link
      href={`/prompt/${template.slug}`}
      style={{
        textDecoration: "none",
      }}
    >
      <Card
        sx={{
          minWidth: isDesktop ? "256px" : "auto",
          height: isDesktop ? "calc(100% - 24px)" : "calc(100% - 16px)",
          borderRadius: "16px",
          cursor: "pointer",
          p: isDesktop ? "16px 16px 8px" : "8px",
          bgcolor: isDesktop ? "transparent" : "surface.2",
          "&:hover": {
            bgcolor: "surface.2",
          },
        }}
        elevation={0}
      >
        <Stack
          direction={isDesktop ? "column" : "row"}
          justifyContent={{ xs: "flex-start", md: "space-between" }}
          alignItems={"flex-start"}
          gap={2}
        >
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              overflow: "hidden",
              width: { xs: "256px", sm: "100%" },
              height: { xs: "191px", sm: "191px" },
            }}
          >
            <Image
              src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={template.title}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </CardMedia>
          <Stack
            flex={1}
            gap={0.5}
          >
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"onSurface"}
            >
              {template.title}
            </Typography>
            <Typography
              fontSize={13}
              fontWeight={400}
              color={"onSurface"}
              sx={{
                opacity: 0.75,
              }}
            >
              {template.executions_count} documents
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}

export default CardDocumentTemplate;
