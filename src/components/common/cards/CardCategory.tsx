import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { Category } from "@/core/api/dto/templates";

export const CategoryCard = ({
  category,
  onClick,
}: {
  category: Category;
  onClick: () => void;
}) => {
  return (
    <Card
      onClick={onClick}
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
            objectFit: "cover",
          }}
          component="img"
          image={category.image}
          alt={category.name}
        />
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
  );
};
