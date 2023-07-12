import { Category } from "@/core/api/dto/templates";
import CardImg from "@/assets/images/cardImg.png";
import Image from "next/image";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export const CategoryCard = ({ category }: { category: Category }) => {
  const truncatedTilte = (str: string) => {
    if (str.length > 22) {
      return str.slice(0, 22) + "...";
    }
    return str;
  };
  return (
    <Card
      title={category.name}
      sx={{
        maxWidth: "230px",
        width: "100%",
        bgcolor: "transparent",
        borderRadius: "27px",
        overflow: "hidden",
        "&:hover": {
          bgcolor: "white",
        },
      }}
      elevation={0}
    >
      <CardActionArea>
        <Box
          position={"relative"}
          width={"100%"}
          height={"180px"}
          component={"div"}
        >
          <Image alt="aa" fill style={{ objectFit: "cover" }} src={CardImg} />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" mt={-1}>
            {truncatedTilte(category.name)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            482 Templates
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
