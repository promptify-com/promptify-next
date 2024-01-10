import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";

import { setGeneratedExecution, setRepeatedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { isDesktopViewPort } from "@/common/helpers";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import AvatarWithInitials from "@/components/Prompt/Common/AvatarWithInitials";
import useTruncate from "@/hooks/useTruncate";
import { isImageOutput } from "../../Utils";
import { setAnswers } from "@/core/store/chatSlice";
import useVariant from "../../Hooks/useVariant";
import type { Prompts } from "@/core/api/dto/prompts";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";

interface CardExecutionProps {
  execution: TemplatesExecutions;
  min?: boolean;
  promptsData: Prompts[];
  variant: string;
}

export const ExecutionItem: React.FC<CardExecutionProps> = ({ execution, min, promptsData, variant }) => {
  const dispatch = useAppDispatch();
  const { isVariantB } = useVariant();
  const { truncate } = useTruncate();
  const isMobile = !isDesktopViewPort();

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const [content, setContent] = useState<string>("");

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const isSelected = execution.id === selectedExecution?.id;

  const getContent = async () => {
    let isImage = false;
    const prompt = execution.prompt_executions?.find(exec => {
      const _prompt = promptsData.find(prompt => prompt.id === exec.prompt);
      isImage = isImageOutput(exec.output, _prompt?.engine?.output_type ?? "TEXT");

      return _prompt;
    });

    const fetchedContent = isImage ? prompt?.output ?? "" : prompt?.output ? await markdownToHTML(prompt?.output) : "";
    setContent(fetchedContent);
  };
  useEffect(() => {
    if (isVariantB) return;
    getContent();
  }, []);

  const updateAnswers = () => {
    const { parameters } = execution;

    const newAnswers = parameters
      ? Object.keys(parameters)
          .map(promptId => {
            const param = parameters[promptId];
            return Object.keys(param).map(inputName => ({
              inputName: inputName,
              required: true,
              question: "",
              answer: param[inputName],
              prompt: parseInt(promptId),
              error: false,
            }));
          })
          .flat()
      : [];
    dispatch(setAnswers(newAnswers));
  };

  const handleClick = () => {
    dispatch(setSelectedExecution(execution));
    dispatch(setGeneratedExecution(null));
    dispatch(setRepeatedExecution(null));
    updateAnswers();
    isMobile && dispatch(setActiveToolbarLink(null));

    if (isVariantB) {
      setTimeout(() => {
        const element = document.getElementById("accordion-execution");
        element && element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
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
              <AvatarWithInitials
                variant="a"
                title={execution.title}
              />

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
                {content.startsWith("http") ? (
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={content ?? require("@/assets/images/default-thumbnail.jpg")}
                      width={80}
                      height={80}
                      alt="Promptify"
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ) : (
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 400, color: "onSurface" }}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(content),
                    }}
                  />
                )}
              </Box>
            </>
          )}
        </Card>
      ) : (
        <Stack
          onClick={handleClick}
          direction={"row"}
          width={"100%"}
          height={"100%"}
          alignItems={"center"}
          gap={"8px"}
          p={1}
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
