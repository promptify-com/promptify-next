import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { Category } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import useBrowser from "@/hooks/useBrowser";
import useToken from "@/hooks/useToken";
import Link from "next/link";

interface Props {
  category: Category;
  href: string;
  index: number;
  min?: boolean;
}

export const CategoryCard = ({ category, href, index, min }: Props) => {
  const token = useToken();
  const { isMobile } = useBrowser();
  const shouldPrioritizeImage = token ? false : isMobile ? index === 0 || index === 1 : true;

  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
    >
      <Card
        elevation={0}
        title={category.name}
        sx={{
          maxWidth: "200px",
          width: min ? "156px" : "200px",
          bgcolor: "transparent",
          borderRadius: "27px",
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
              borderRadius: "16px",
              width: "100%",
              height: "200px",
            }}
          >
            <Image
              src={category.image}
              alt={category.name}
              style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
              priority={shouldPrioritizeImage}
            />
          </CardMedia>

          {!min && (
            <Typography
              variant="h1"
              fontSize={16}
              fontWeight={500}
              lineHeight={"20.8px"}
              color={"white"}
              mx={2}
              position={"absolute"}
              top={8}
            >
              {category.name}
            </Typography>
          )}
          <CardContent sx={{ padding: "8px", m: 0 }}>
            <Typography
              gutterBottom
              fontSize={12}
              lineHeight={"16.8px"}
              component="div"
            >
              {category.name}
            </Typography>
            {!min && (
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={12}
              >
                {category.prompt_template_count} templates
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};
