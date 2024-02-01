import { useRef } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import CardMedia from "@mui/material/CardMedia";
import { alpha } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tune from "@mui/icons-material/Tune";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { theme } from "@/theme";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";
import { useCreateTemplateMutation } from "@/core/api/templates";
import { isValidUserFn } from "@/core/store/userSlice";
import { getBaseUrl, redirectToPath } from "@/common/helpers";
import { IEditPrompts } from "@/common/types/builder";
import FavoriteIcon from "./FavoriteIcon";
import BaseButton from "@/components/base/BaseButton";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import { ViewWeekOutlined, WebAssetOutlined } from "@mui/icons-material";
import ClientOnly from "@/components/base/ClientOnly";
import useCloneTemplate from "@/components/Prompt/Hooks/useCloneTemplate";
import { isAdminFn } from "@/core/store/userSlice";

interface TemplateHeaderProps {
  template: Templates;
}

export default function Header({ template }: TemplateHeaderProps) {
  const router = useRouter();
  const { switchVariant, variant, isVariantA } = useVariant();
  const { cloneTemplate } = useCloneTemplate({ template });
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(isAdminFn);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isOwner = isAdmin || currentUser?.id === template.created_by.id;
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
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
      >
        {isVariantA && (
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
            {isOwner ? (
              <Button
                onClick={() => window.open(`${getBaseUrl}/prompt-builder/${template.slug}?editor=1`, "_blank")}
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
            ) : (
              <Button
                onClick={cloneTemplate}
                sx={{
                  p: "8px 11px",
                  color: "secondary.main",
                  fontSize: 13,
                  fontWeight: 500,
                  gap: 1,
                }}
              >
                <ContentCopy sx={{ fontSize: 20 }} />
                Clone
              </Button>
            )}
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
        )}

        <ClientOnly>
          <BaseButton
            variant="text"
            color="custom"
            sx={btnStyle}
            disabled={isGenerating}
            onClick={switchVariant}
          >
            {variant === "a" ? <WebAssetOutlined /> : <ViewWeekOutlined />}
          </BaseButton>
        </ClientOnly>
      </Stack>
    </Stack>
  );
}

const btnStyle = {
  color: "secondary.main",
  fontSize: 14,
  p: "6px 0px",
  borderRadius: "8px",
  border: "none",
  minWidth: "40px",
  ":hover": {
    bgcolor: "action.hover",
  },
};

const breadcrumbStyle = {
  color: alpha(theme.palette.text.secondary, 0.45),
  fontSize: 13,
  p: "8px 11px",
  ":hover": {
    color: theme.palette.text.secondary,
  },
};
