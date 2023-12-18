import { Box, Card, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { useDispatch } from "react-redux";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { getAbbreviation, isDesktopViewPort } from "@/common/helpers";
import { Prompts } from "@/core/api/dto/prompts";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import AvatarWithInitials from "@/components/Prompt/Common/AvatarWithInitials";
import useTruncate from "@/hooks/useTruncate";
import { isImageOutput } from "../../Utils";

interface CardExecutionProps {
  execution: TemplatesExecutions;
  min?: boolean;
  promptsData: Prompts[];
  variant: string;
}

export const ExecutionItem: React.FC<CardExecutionProps> = ({ execution, min, promptsData, variant }) => {
  const dispatch = useDispatch();
  const isMobile = !isDesktopViewPort();
  const { truncate } = useTruncate();

  const [content, setContent] = useState<string>("");
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const isSelected = execution.id === selectedExecution?.id;
  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const getContent = async () => {
    const prompt = execution.prompt_executions?.find(exec => {
      const _prompt = promptsData.find(prompt => prompt.id === exec.prompt)!;

      return !isImageOutput(exec.output, _prompt?.engine?.output_type);
    });
    const fetchedContent = await markdownToHTML(prompt?.output || "");
    setContent(fetchedContent);
  };
  useEffect(() => {
    getContent();
  }, []);

  const handleClick = () => {
    dispatch(setSelectedExecution(execution));
    isMobile && dispatch(setActiveToolbarLink(null));
  };

  const saveExecution = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (execution.is_favorite) {
        await deleteExecutionFavorite(execution.id);
      } else {
        await favoriteExecution(execution.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {variant === "a" ? (
        <Card
          onClick={handleClick}
          elevation={0}
          sx={{
            bgcolor: isSelected && !min ? "primaryContainer" : "surface.3",
            borderRadius: "8px",
            p: "8px",
            cursor: "pointer",
            "&:hover, &:focus": {
              bgcolor: isSelected && !min ? "primaryContainer" : "surface.5",
            },
          }}
        >
          {min ? (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
            >
              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  width: 38,
                  height: 38,
                  p: "8px",
                  bgcolor: "#375CA9",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  fontSize={18}
                  fontWeight={700}
                  color={"primary.contrastText"}
                >
                  {getAbbreviation(execution.title)}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  width: "90%",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "onSurface",
                }}
              >
                {execution.title}
              </Typography>
            </Stack>
          ) : (
            <>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                p={"4px"}
              >
                <Tooltip
                  title="Save"
                  enterDelay={1000}
                  enterNextDelay={1000}
                >
                  <IconButton
                    onClick={saveExecution}
                    sx={{
                      border: "none",
                      p: "6px",
                      "&:hover": {
                        bgcolor: "surface.2",
                        opacity: 1,
                      },
                      svg: {
                        width: "24px",
                        height: "24px",
                      },
                    }}
                  >
                    {execution.is_favorite ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Tooltip>
                <Typography
                  sx={{
                    width: "80%",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "onSurface",
                  }}
                >
                  {execution.title}
                </Typography>
              </Stack>
              <Box
                sx={{
                  bgcolor: "surface.1",
                  p: "16px 12px",
                  borderRadius: "10px",
                  height: "15svh",
                  overflow: "hidden",
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "onSurface", py: "12px" }}>
                  {execution.title}
                </Typography>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 400, color: "onSurface" }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(content),
                  }}
                />
              </Box>
            </>
          )}
        </Card>
      ) : (
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={"8px"}
        >
          <AvatarWithInitials title={execution.title} />
          <Stack flex={1}>
            <Typography
              sx={{
                fontSize: 15,
              }}
            >
              {truncate(execution.title, { length: 50 })}
            </Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};
