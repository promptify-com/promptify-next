import Image from "next/image";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

import CardImg from "@/assets/images/cardImg.png";
import { Category } from "@/core/api/dto/templates";

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
      elevation={0}
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
    >
      <CardActionArea>
        <Box
          position={"relative"}
          width={"100%"}
          height={"180px"}
          component={"div"}
          sx={{
            borderRadius: "27px",
            overflow: "hidden",
          }}
        >
          <Image alt="aa" fill style={{ objectFit: "cover" }} src={CardImg} />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" mt={-1}>
            {truncatedTilte(category.name)}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={12}>
            482 Templates
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
