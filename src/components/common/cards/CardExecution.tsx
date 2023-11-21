import { Avatar, Box, Card, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { useDispatch } from "react-redux";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { isImageOutput, markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { useExecutionFavoriteMutation } from "@/core/api/executions";
import useTruncate from "@/hooks/useTruncate";
import AvatarWithInitials from "@/components/prompt/AvatarWithInitials";

interface CardExecutionProps {
  execution: TemplatesExecutions;
}

export const CardExecution: React.FC<CardExecutionProps> = ({ execution }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>("");
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const isSelected = execution.id === selectedExecution?.id;
  const [favoriteExecution] = useExecutionFavoriteMutation();

  const getContent = async () => {
    const prompt = execution.prompt_executions?.find(exec => !isImageOutput(exec.output));
    const fetchedContent = await markdownToHTML(prompt?.output || "");
    setContent(fetchedContent);
  };
  useEffect(() => {
    getContent();
  }, []);

  const handleClick = () => {
    dispatch(setSelectedExecution(execution));
  };

  const saveExecution = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await favoriteExecution(execution.id);
    } catch (error) {
      console.error(error);
    }
  };

  const { truncate } = useTruncate();

  return (
    <Stack
      direction={"row"}
      gap={"8px"}
    >
      <AvatarWithInitials title={execution.title} />
      <Stack>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          {truncate(execution.title, { length: 30 })}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          Text with markup. 12k words, 3 images
        </Typography>
      </Stack>
    </Stack>
  );
};
