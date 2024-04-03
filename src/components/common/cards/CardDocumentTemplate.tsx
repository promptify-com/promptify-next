import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import Link from "next/link";
import useBrowser from "@/hooks/useBrowser";

type CardDocumentTemplateProps = {
  template: TemplateExecutionsDisplay;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  active?: boolean;
};

function CardDocumentTemplate({ template, onClick, active }: CardDocumentTemplateProps) {
  const { isMobile } = useBrowser();

  return (
    <Link
      href={`/prompt/${template.slug}`}
      onClick={onClick}
      style={{
        textDecoration: "none",
      }}
    >
      <Card
        className={active ? "active" : ""}
        sx={{
          minWidth: isMobile ? "auto" : "246px",
          height: isMobile ? "calc(100% - 16px)" : "calc(100% - 24px)",
          borderRadius: "16px",
          cursor: "pointer",
          p: isMobile ? "8px" : "16px 16px 8px",
          bgcolor: isMobile ? "surface.2" : "transparent",
          "&.active, &:hover": {
            bgcolor: "surface.2",
          },
        }}
        elevation={0}
      >
        <Stack
          direction={isMobile ? "row" : "column"}
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
