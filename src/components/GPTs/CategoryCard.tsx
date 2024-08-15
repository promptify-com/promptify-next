import Link from "next/link";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTruncate from "@/hooks/useTruncate";
import Image from "@/components/design-system/Image";

interface Props {
  name: string;
  description: string;
  templates: any;
}

function CategoryCard({ name, description, templates }: Props) {
  const { truncate } = useTruncate();

  const firstTemplate = templates[0];
  const categorySlug = name.split(" ").join("-").toLowerCase();

  return (
    <>
      <Link
        href={`/apps/category/${categorySlug}`}
        style={{ textDecoration: "none" }}
      >
        <Stack
          flex={1}
          p={"8px"}
          width={{ xs: "282px", md: "487px" }}
          minWidth={{ xs: "282px", md: "487px" }}
          direction={{ xs: "column", md: "row" }}
          bgcolor={"#F9F9F9"}
          borderRadius={"16px"}
          position={"relative"}
        >
          <Box
            width={{ xs: "100%", md: "180px" }}
            height={{ xs: "266px", md: "180px" }}
            borderRadius={"18px"}
            overflow={"hidden"}
            position={"relative"}
          >
            <Image
              src={firstTemplate?.image ?? ""}
              fill
              alt={firstTemplate?.name ?? "category"}
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Stack
            p={{ xs: "16px", md: "40px 10px 16px 24px" }}
            flex={1}
            gap={"24px"}
            alignItems={"start"}
            justifyContent={"space-between"}
          >
            <Stack gap={"8px"}>
              <Typography
                fontSize={"16px"}
                fontWeight={500}
                color={"#000"}
                lineHeight={"120%"}
              >
                {name ?? ""}
              </Typography>
              <Typography
                fontSize={11}
                fontWeight={400}
                lineHeight={"150%"}
                color={"#000"}
                maxWidth={"180px"}
              >
                {truncate(description || "", { length: 160 })}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Link>
    </>
  );
}

export default CategoryCard;
