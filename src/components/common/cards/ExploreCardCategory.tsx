import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Image from "@/components/design-system/Image";
import Link from "next/link";
import { Category } from "@/core/api/dto/templates";
import Typography from "@mui/material/Typography";
import useBrowser from "@/hooks/useBrowser";
import { CategoryCard } from "./CardCategory";

interface Props {
  category: Category;
}

function ExploreCardCategory({ category }: Props) {
  const { isMobile } = useBrowser();
  return (
    <>
      {isMobile ? (
        <CategoryCard
          category={category}
          priority={false}
          href={`/explore/${category.slug}`}
          min={!isMobile}
        />
      ) : (
        <Link
          href={`/explore/${category.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Card
            elevation={0}
            title={category.name}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "24px",
              bgcolor: "#ffffff",
              width: "208px",
              height: "350px",
              p: "8px 8px 4px 8px",
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
                  display: "flex",
                  width: "100%",
                  height: "291px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "24px",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
                  priority={true}
                />
              </CardMedia>
              <CardContent sx={{ p: "8px 0", m: 0 }}>
                <Typography
                  gutterBottom
                  fontSize={12}
                  lineHeight={"16.8px"}
                  component="div"
                >
                  {category.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={12}
                >
                  {category.prompt_template_count} templates
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      )}
    </>
  );
}

export default ExploreCardCategory;
