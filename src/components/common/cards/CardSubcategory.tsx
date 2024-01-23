import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { Category } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import Link from "next/link";

interface CardSubcategoryProps {
  subcategory: Category;
  categorySlug: string;
}

export default function SubCategoryCard({ subcategory, categorySlug }: CardSubcategoryProps) {
  return (
    <Link
      href={`/explore/${categorySlug}/${subcategory.slug}`}
      style={{ textDecoration: "none" }}
    >
      <Card
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
              src={"https://promptify.s3.amazonaws.com/b2ef452894b9464786556b89c63a213b"}
              alt={subcategory.name}
              style={{ borderRadius: "100%", objectFit: "cover", width: "100%", height: "100%" }}
            />
          </CardMedia>
          <Typography sx={{ ml: "", whiteSpace: "nowrap" }}>{subcategory.name}</Typography>
        </CardActionArea>
      </Card>
    </Link>
  );
}
