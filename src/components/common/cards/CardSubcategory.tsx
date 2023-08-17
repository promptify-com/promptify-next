import React from "react";
import { Card, CardActionArea, CardMedia, Typography } from "@mui/material";

import { Category } from "@/core/api/dto/templates";

import Image from "@/components/design-system/Image";

interface CardSubcategoryProps {
  subcategory: Category;
  onSelected?: () => void;
}

export const SubCategoryCard: React.FC<CardSubcategoryProps> = ({
  subcategory,
  onSelected,
}) => {
  return (
    <Card
      onClick={onSelected}
      sx={{
        bgcolor: { xs: "surface.2", md: "white" },
        borderRadius: "45px",
        display: "flex",
        height: "46px",
        width: "fit-content",
      }}
      elevation={0}
    >
      <CardActionArea
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          p4: 4,
        }}
      >
        <CardMedia
          sx={{
            zIndex: 1,
            borderRadius: "100%",
            width: "32px",
            height: "32px",
          }}
        >
          <Image
            src={
              "https://promptify.s3.amazonaws.com/b2ef452894b9464786556b89c63a213b"
            }
            alt={subcategory.name}
            borderRadius="100%"
          />
        </CardMedia>
        <Typography sx={{ ml: "", whiteSpace: "nowrap" }}>
          {subcategory.name}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
