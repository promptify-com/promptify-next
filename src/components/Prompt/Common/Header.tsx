import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import CardMedia from "@mui/material/CardMedia";
import { alpha } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIos";

import { theme } from "@/theme";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useAppDispatch } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";

interface TemplateHeaderProps {
  template: Templates;
}

export default function Header({ template }: TemplateHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
      href="/explore"
      onClick={e => {
        e.preventDefault();
        dispatch(setSelectedTag(template.category));
        router.push("/explore");
      }}
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
      alignItems={"baseline"}
      justifyContent={"space-between"}
      sx={{
        p: "8px 16px",
        bgcolor: "surface.1",
        display: { xs: "none", md: "flex" },
      }}
    >
      <Breadcrumbs
        separator={<ArrowBackIosNew sx={{ fontSize: 16, color: alpha(theme.palette.text.secondary, 0.45) }} />}
      >
        {breadcrumbs}
      </Breadcrumbs>
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
