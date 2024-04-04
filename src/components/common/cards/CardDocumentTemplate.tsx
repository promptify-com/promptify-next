import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import Link from "next/link";

type CardDocumentTemplateProps = {
  template: TemplateExecutionsDisplay;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

function CardDocumentTemplate({ template, onClick }: CardDocumentTemplateProps) {
  return (
    <Link
      href={`/prompt/${template.slug}`}
      onClick={onClick}
      style={{
        textDecoration: "none",
      }}
    >
      <Card
        sx={{
          minWidth: { xs: "auto", md: "246px" },
          height: { xs: "calc(100% - 16px)", md: "calc(100% - 24px)" },
          borderRadius: "16px",
          cursor: "pointer",
          p: "16px 16px 8px",
          bgcolor: "transparent",
          "&:hover": {
            bgcolor: "surface.2",
          },
        }}
        elevation={0}
      >
        <Stack
          alignItems={"flex-start"}
          gap={2}
        >
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              overflow: "hidden",
              width: { xs: 180, md: "100%" },
              height: { xs: 135, md: 191 },
              maxWidth: "100%",
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
              fontSize={{ xs: 14, md: 16 }}
              fontWeight={500}
              color={"onSurface"}
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
              }}
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
              {template.executions?.length} documents
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}

export default CardDocumentTemplate;
