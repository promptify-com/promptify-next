import Stack from "@mui/material/Stack";
import type { Templates } from "@/core/api/dto/templates";
import { Avatar, Box, Breadcrumbs, Button, CardMedia, Link, alpha } from "@mui/material";
import { ArrowBackIosNew, Tune } from "@mui/icons-material";
import { theme } from "@/theme";
import FavoriteIcon from "./FavoriteIcon";

interface TemplateHeaderProps {
  template: Templates;
}

export default function Header({ template }: TemplateHeaderProps) {
  const breadcrumbs = [
    <Link
      key="0"
      href="/explore"
      sx={breadcrumbStyle}
    >
      All Templates
    </Link>,
    <Link
      key="1"
      href={`/explore/${template.category.slug}`}
      sx={breadcrumbStyle}
    >
      {template.category.name}
    </Link>,
    <Link
      key="2"
      sx={{
        ...breadcrumbStyle,
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <CardMedia
        sx={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
        component="img"
        image={template.thumbnail}
        alt={template.title}
      />
      {template.title}
    </Link>,
  ];

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        p: "8px 16px",
        bgcolor: "surface.1",
      }}
    >
      <Breadcrumbs
        separator={<ArrowBackIosNew sx={{ fontSize: 16, color: alpha(theme.palette.text.secondary, 0.45) }} />}
      >
        {breadcrumbs}
      </Breadcrumbs>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        fontSize={13}
      >
        <Button
          sx={{
            p: "0",
          }}
        >
          <FavoriteIcon
            style={{
              sx: {
                color: "secondary.main",
                fontSize: 13,
                fontWeight: 500,
                gap: 1,
                svg: {
                  width: 20,
                  height: 20,
                },
              },
            }}
          />
        </Button>
        <Button
          sx={{
            p: "8px 11px",
            color: "secondary.main",
            fontSize: 13,
            fontWeight: 500,
            gap: 1,
          }}
        >
          <Tune sx={{ fontSize: 20 }} />
          Customize
        </Button>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={0.5}
          sx={{
            p: "8px 11px",
            color: "secondary.main",
            fontSize: 13,
            fontWeight: 500,
            gap: 1,
          }}
        >
          by {template.created_by.first_name || "Promptify"}
          <Avatar
            src={template.created_by.avatar}
            alt={template.created_by.username}
            sx={{ width: 30, height: 30 }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

const breadcrumbStyle = {
  color: alpha(theme.palette.text.secondary, 0.45),
  fontSize: 13,
  p: "8px 11px",
  ":hover": {
    color: theme.palette.text.secondary,
  },
};
