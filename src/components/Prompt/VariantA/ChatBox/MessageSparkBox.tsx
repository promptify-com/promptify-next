import { Box, Card, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { useDispatch } from "react-redux";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { Prompts } from "@/core/api/dto/prompts";
import { isImageOutput } from "../../Utils";
import AvatarWithInitials from "@/components/Prompt/Common/AvatarWithInitials";

interface MessageSparkBoxProps {
  execution: TemplatesExecutions;
  onClick?: () => void;
  min?: boolean;
  promptsData?: Prompts[];
}

export const MessageSparkBox: React.FC<MessageSparkBoxProps> = ({ execution, min, onClick, promptsData }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>("");
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const isSelected = execution.id === selectedExecution?.id;
  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const getContent = async () => {
    const prompt = execution.prompt_executions?.find(exec => {
      const _prompt = promptsData && promptsData.find(prompt => prompt.id === exec.prompt)!;

      return !isImageOutput(exec.output, _prompt?.engine?.output_type!);
    });
    const fetchedContent = await markdownToHTML(prompt?.output || "");
    setContent(fetchedContent);
  };
  useEffect(() => {
    getContent();
  }, []);

  const handleClick = () => {
    dispatch(setSelectedExecution(execution));
    if (onClick) onClick();
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
            title={execution.title}
            variant="a"
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
  );
};
