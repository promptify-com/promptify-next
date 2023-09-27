import React, { useState } from "react";
import { Box, Button, Chip, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import { Subtitle } from "@/components/blocks";
import moment from "moment";
import { useRouter } from "next/router";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FavoriteMobileButton from "@/components/common/buttons/FavoriteMobileButton";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { Create } from "@mui/icons-material";
import Clone from "@/assets/icons/Clone";
import { useCreateTemplateMutation } from "@/core/api/templates";
import { INodesData } from "@/common/types/builder";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { RootState } from "@/core/store";
import { isValidUserFn } from "@/core/store/userSlice";
import { useSelector } from "react-redux";
import ApiAccess from "./ApiAccess";

interface DetailsProps {
  templateData: Templates;
  setMobileTab?: (value: number) => void;
  mobile?: boolean;
}

export const Details: React.FC<DetailsProps> = ({ templateData, setMobileTab = () => {}, mobile }) => {
  const router = useRouter();
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const [isCloning, setIsCloning] = useState(false);
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useAppSelector((state: RootState) => state.user.currentUser);
  const [createTemplate] = useCreateTemplateMutation();

  const cloneTemplate = async () => {
    if (!isValidUser) {
      return router.push("/signin");
    }

    if (!isCloning) {
      setIsCloning(true);

      try {
        const clonedPrompts: INodesData[] = templateData.prompts.map(prompt => {
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

        const response = await createTemplate({
          title: `${templateData.title} - Copy`,
          description: templateData.description,
          duration: templateData.duration.toString(),
          difficulty: templateData.difficulty,
          is_visible: templateData.is_visible,
          language: templateData.language,
          category: templateData.category?.id,
          context: templateData.context,
          tags: templateData.tags,
          thumbnail: templateData.thumbnail,
          executions_limit: templateData.executions_limit,
          meta_title: templateData.meta_title,
          meta_description: templateData.meta_description,
          meta_keywords: templateData.meta_keywords,
          status: "DRAFT",
          prompts_list: clonedPrompts,
        }).unwrap();

        const { id, slug } = response;
        window.open(window.location.origin + `/builder/${id}?editor=1`, "_blank");
        router.push(`/prompt/${slug}`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCloning(false);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "surface.1", p: "16px" }}>
      <Box>
        <Stack
          direction={"row"}
          sx={{ pb: { xs: "16px", md: 0 } }}
        >
          {mobile && (
            <>
              <FavoriteMobileButton />
              <Button
                variant="outlined"
                endIcon={<ExitToAppIcon />}
                onClick={() => {
                  setMobileTab(1);
                }}
                sx={{
                  p: "8px 16px",
                  bgcolor: palette.primary.main,
                  color: "onPrimary",
                  fontSize: 14,
                  borderColor: alpha(palette.primary.main, 0.3),
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: palette.primary.main,
                    borderColor: alpha(palette.primary.main, 0.8),
                  },
                  ml: "10px",
                }}
              >
                Create Now!
              </Button>
            </>
          )}
        </Stack>
        <Box sx={{ py: "16px" }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 400, color: "onSurface" }}
            dangerouslySetInnerHTML={{ __html: templateData.description }}
          />
        </Box>
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          gap={1}
          sx={{ pb: "25px" }}
        >
          {templateData.tags.length > 0 ? (
            templateData.tags.map(tag => (
              <Chip
                key={tag.id}
                onClick={() => {
                  dispatch(setSelectedTag(tag));

                  router.push("/explore");
                }}
                variant={"filled"}
                label={tag.name}
                sx={{
                  fontSize: 13,
                  fontWeight: 400,
                  bgcolor: "surface.3",
                  color: "onSurface",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              />
            ))
          ) : (
            <Typography
              fontSize={12}
              color={"onSurface"}
            >
              No tag assigned
            </Typography>
          )}
        </Stack>
        <Box sx={{ pb: "25px" }}>
          <Subtitle sx={{ mb: "12px", color: "tertiary" }}>Metrics Overview</Subtitle>
          <Stack gap={1}>
            {templateData.last_run && (
              <Typography sx={detailsStyle}>
                Last run: <span>{moment(templateData.last_run).fromNow()}</span>
              </Typography>
            )}
            <Typography sx={detailsStyle}>
              Updated: <span>{moment(templateData.updated_at).format("D MMMM YYYY")}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Created: <span>{moment(templateData.created_at).format("D MMMM YYYY")}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Views: <span>{templateData.views}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Runs: <span>{templateData.executions_count}</span>
            </Typography>
          </Stack>
        </Box>
        {!!templateData && (
          <>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                pb: "25px",
              }}
            >
              <Subtitle sx={{ mb: "12px", color: "tertiary" }}>Actions</Subtitle>
              <Stack gap={1}>
                {(currentUser?.is_admin || currentUser?.id === templateData.created_by.id) && (
                  <Button
                    variant={"contained"}
                    startIcon={<Create />}
                    sx={templateBtnStyle}
                    onClick={() => {
                      window.open(window.location.origin + `/builder/${templateData.id}?editor=1`, "_blank");
                    }}
                  >
                    Edit this Template
                  </Button>
                )}
                <Button
                  variant={"contained"}
                  startIcon={<Clone />}
                  sx={templateBtnStyle}
                  onClick={cloneTemplate}
                  disabled={isCloning}
                >
                  Clone and Edit
                </Button>
              </Stack>
            </Box>
            {isValidUser && <ApiAccess templateData={templateData} />}
          </>
        )}
      </Box>
    </Box>
  );
};

const detailsStyle = {
  fontSize: 14,
  fontWeight: 400,
  color: "grey.600",
  span: {
    color: "common.black",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const templateBtnStyle = {
  flex: 1,
  p: "8px 22px",
  fontSize: 15,
  fontWeight: 500,
  border: "none",
  borderRadius: "999px",
  bgcolor: "surface.3",
  color: "onSurface",
  svg: {
    width: 24,
    height: 24,
  },
  ":hover": {
    bgcolor: "surface.4",
  },
};
