import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "@/components/design-system/Image";
import { ITutorial } from "./Types";

interface Props {
  tutorial: ITutorial;
}
function TutorialCard({ tutorial }: Props) {
  const { title, image, content, link } = tutorial;

  return (
    <Link
      href={link}
      target="_blank"
      style={{ textDecoration: "none" }}
    >
      <Card
        elevation={0}
        title={title}
        sx={{
          bgcolor: "transparent",
          p: "8px",
          border: "1px solid",
          borderColor: "surfaceContainerHighest",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <CardActionArea
          sx={{
            position: "relative",
          }}
        >
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "24px",
              width: "100%",
              height: 158,
            }}
          >
            <Image
              src={image || require("@/assets/images/default-thumbnail.jpg")}
              alt={title}
              style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
              priority={false}
            />
          </CardMedia>
        </CardActionArea>
        <CardContent sx={{ p: "14px 16px 8px !important", m: 0 }}>
          <Stack gap={2}>
            <Typography
              fontSize={{ xs: 14, md: 16 }}
              fontWeight={500}
              color={"onSurface"}
            >
              {title}
            </Typography>
            <Typography
              fontSize={{ xs: 12, md: 14 }}
              fontWeight={400}
              color={"onSurface"}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {content}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
}

export default TutorialCard;
