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
import useTruncate from "@/hooks/useTruncate";

interface Props {
  category: Category;
  href: string;
  index?: number;
  priority?: boolean;
  min?: boolean;
}

export const CategoryCard = ({ category, href, index, priority, min }: Props) => {
  const token = useToken();
  const { isMobile } = useBrowser();
  const { truncate } = useTruncate();
  const shouldPrioritizeImage = priority === true ? true : token ? false : isMobile ? index === 0 || index === 1 : true;
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
          width: { xs: "100px", md: min ? "156px" : "200px" },
          bgcolor: "transparent",
          borderRadius: "27px",
          overflow: "hidden",
          mx: "8px",
        }}
      >
        <CardActionArea
          sx={{
            position: "relative",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:hover .MuiCardActionArea-focusHighlight": {
              opacity: 0,
            },
          }}
        >
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              width: "100%",
              height: { xs: "130px", md: "200px" },
            }}
          >
            <Image
              src={category.image}
              alt={category.name}
              style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
              priority={shouldPrioritizeImage}
            />
          </CardMedia>

          {!min && !isMobile && (
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
              minHeight={{ xs: "35px", md: "fit-content" }}
            >
              {truncate(category.name, { length: isMobile ? 20 : 30 })}
            </Typography>
            {(!min || isMobile) && (
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
