import Link from "next/link";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import Image from "@/components/design-system/Image";
import useTruncate from "@/hooks/useTruncate";
import { redirectToPath, stripTags } from "@/common/helpers";

type CardTemplateProps = {
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
  query?: string;
};

function CardTemplateResult({ title, description, slug, thumbnail, query }: CardTemplateProps) {
  const { truncate } = useTruncate();

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
      href={`/prompt/${slug}`}
      onClick={() => {
        redirectToPath(`/prompt/${slug}`);
      }}
      style={{
        textDecoration: "none",
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
                src={thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
                alt={title}
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
                {highlightSearchQuery(title)}
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
                {highlightSearchQuery(truncate(stripTags(description), { length: 70 }))}
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
