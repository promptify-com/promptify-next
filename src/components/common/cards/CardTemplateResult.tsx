import Link from "next/link";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import useTruncate from "@/hooks/useTruncate";
import { isDesktopViewPort, redirectToPath, stripTags } from "@/common/helpers";

type CardTemplateProps = {
  template: Templates | TemplateExecutionsDisplay;
  query?: string;
};

function CardTemplateResult({ template, query }: CardTemplateProps) {
  const { truncate } = useTruncate();
  const isDesktop = isDesktopViewPort();

  const highlightSearchQuery = (text: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span
          key={idx}
          style={{ color: "#375CA9", fontWeight: "bold", textDecoration: "underline" }}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <Link
      href={`/prompt/${template.slug}`}
      onClick={() => {
        redirectToPath(`/prompt/${template.slug}`);
      }}
      style={{
        flex: isDesktop ? 1 : "none",
        textDecoration: "none",
        width: isDesktop ? "auto" : "100%",
      }}
    >
      <Card
        sx={{
          width: "auto",
          minWidth: "auto",
          height: "calc(100% - 16px)",
          borderRadius: "16px",
          cursor: "pointer",
          p: "8px",
          bgcolor: "surface.2",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        elevation={0}
      >
        <Stack
          direction={"column"}
          alignItems={"start"}
          justifyContent={"space-between"}
          gap={1}
          height={"100%"}
        >
          <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            flexWrap={"wrap"}
            gap={2}
            width={"100%"}
            height={"100%"}
          >
            <CardMedia
              sx={{
                zIndex: 1,
                borderRadius: "16px",
                overflow: "hidden",
                width: "98px",
                height: "73px",
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
                fontSize={14}
                fontWeight={500}
              >
                {highlightSearchQuery(template.title)}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "16.8px",
                  letterSpacing: "0.15px",
                  color: "onSurface",
                  opacity: 1,
                }}
              >
                {highlightSearchQuery(truncate(stripTags(template.description), { length: 70 }))}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}

const iconTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "onSurface",
  svg: {
    fontSize: 14,
  },
};

export default CardTemplateResult;
