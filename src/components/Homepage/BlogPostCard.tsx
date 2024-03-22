import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "@/components/design-system/Image";
import { IBlogPost } from "./Types";
import useTruncate from "@/hooks/useTruncate";

interface Props {
  post: IBlogPost;
  min?: boolean;
}
function BlogPostCard({ post, min }: Props) {
  const { title, image, content, link } = post;
  const { truncate } = useTruncate();

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
          height: "100%",
          bgcolor: "transparent",
          borderRadius: "24px",
          overflow: "hidden",
          "&:hover": {
            bgcolor: "white",
          },
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
              height: min ? "200px" : "340px",
              position: "relative",
            }}
          >
            <Image
              src={image}
              alt={title}
              style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
              priority={false}
            />
            <Typography
              fontSize={14}
              fontWeight={400}
              sx={{
                position: "absolute",
                left: "22px",
                top: "17px",
                p: "4px 12px",
                borderRadius: "99px",
                bgcolor: "#000000CC",
                color: "#FFFFFF",
              }}
            >
              Blog Post
            </Typography>
          </CardMedia>
        </CardActionArea>
        <CardContent sx={{ padding: "8px", m: 0 }}>
          <Stack gap={2}>
            {!min && (
              <Typography
                fontSize={24}
                fontWeight={500}
                color={"#000000"}
              >
                {title}
              </Typography>
            )}
            <Typography
              fontSize={14}
              fontWeight={400}
              color={"#000000"}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {truncate(min ? title : content, { length: 160 })}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
}

export default BlogPostCard;
