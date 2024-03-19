import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIos";
import { theme } from "@/theme";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useAppDispatch } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";

interface TemplateHeaderProps {
  template: Templates;
  close?(): void;
}

export default function Header({ template, close }: TemplateHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const breadcrumbs = [
    <Link
      key="0"
      href="/explore"
      onClick={e => {
        e.preventDefault();
        router.push("/explore");
        close?.();
      }}
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
        close?.();
      }}
      sx={breadcrumbStyle}
    >
      {template.category?.name}
    </Link>,
    <Typography
      key="2"
      sx={{
        ...breadcrumbStyle,
        color: "onSurface",
        ":hover": {
          color: "onSurface",
        },
      }}
    >
      {template.title}
    </Typography>,
  ];

  return (
    <Stack
      direction={"row"}
      alignItems={"baseline"}
      justifyContent={"space-between"}
      sx={{
        p: "24px 48px",
        display: { xs: "none", md: "flex" },
      }}
    >
      <Breadcrumbs separator={<ArrowBackIosNew sx={{ fontSize: 14, color: alpha(theme.palette.onSurface, 0.3) }} />}>
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}

const breadcrumbStyle = {
  color: alpha(theme.palette.onSurface, 0.3),
  fontSize: 16,
  fontWeight: 400,
  letterSpacing: ".2px",
  p: "8px",
  ":hover": {
    color: theme.palette.text.secondary,
  },
};
