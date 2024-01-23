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
import useVariant from "../Hooks/useVariant";
import { ViewWeekOutlined, WebAssetOutlined } from "@mui/icons-material";
import ClientOnly from "@/components/base/ClientOnly";

interface TemplateHeaderProps {
  template: Templates;
}

export default function Header({ template }: TemplateHeaderProps) {
  const router = useRouter();
  const { switchVariant, variant, isVariantA } = useVariant();
  const dispatch = useAppDispatch();

  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const currentUser = useAppSelector(state => state.user.currentUser);
  const isValidUser = useAppSelector(isValidUserFn);

  const [createTemplate] = useCreateTemplateMutation();

  const isCloning = useRef(false);

  const cloneTemplate = async () => {
    if (!isValidUser) {
      return router.push("/signin");
    }

    if (!isCloning.current) {
      isCloning.current = true;

      try {
        const clonedPrompts: IEditPrompts[] = template.prompts.map(prompt => {
          const params = prompt.parameters.map(param => ({
            parameter_id: param.parameter.id,
            score: param.score,
            is_visible: param.is_visible,
            is_editable: param.is_editable,
          }));

          return {
            temp_id: prompt.id,
            title: prompt.title,
            content: prompt.content,
            engine_id: prompt.engine.id,
            model_parameters: prompt.model_parameters,
            dependencies: prompt.dependencies || [],
            is_visible: prompt.is_visible,
            show_output: prompt.show_output,
            prompt_output_variable: prompt.prompt_output_variable,
            order: prompt.order,
            parameters: params || [],
            output_format: prompt.output_format,
          };
        });

        const { slug } = await createTemplate({
          title: `${template.title} - Copy`,
          description: template.description,
          duration: template.duration.toString(),
          difficulty: template.difficulty,
          is_visible: template.is_visible,
          language: template.language,
          category: template.category?.id,
          context: template.context,
          tags: template.tags,
          thumbnail: template.thumbnail,
          executions_limit: template.executions_limit,
          meta_title: template.meta_title,
          meta_description: template.meta_description,
          meta_keywords: template.meta_keywords,
          status: "DRAFT",
          prompts_list: clonedPrompts,
        }).unwrap();

        window.open(`${getBaseUrl}/prompt-builder/${slug}?editor=1`, "_blank");
        redirectToPath(`/prompt/${slug}`);
      } catch (err) {
        console.error(err);
      } finally {
        isCloning.current = false;
      }
    }
  };

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
            {currentUser?.is_admin || currentUser?.id === template.created_by.id ? (
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
