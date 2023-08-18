import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { Category } from "@/core/api/dto/templates";
import Link from "next/link";

import Image from "@/components/design-system/Image";

export const CategoryCard = ({
  category,
  href,
}: {
  category: Category;
  href: string;
}) => {
  return (
    <Link href={{ pathname: href }} style={{ textDecoration: "none" }}>
      <Card
        title={category.name}
        elevation={0}
        sx={{
          maxWidth: "200px",
          width: "200px",
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
            <Image src={category.image} alt={category.name} style={{borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%"}}/>
          </CardMedia>

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
          <CardContent sx={{ padding: "8px", m: 0 }}>
            <Typography
              gutterBottom
              fontSize={12}
              lineHeight={"16.8px"}
              component="div"
            >
              {category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize={12}>
              {category.prompt_template_count} templates
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};
