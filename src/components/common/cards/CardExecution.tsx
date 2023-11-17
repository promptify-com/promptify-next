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

  const getInitials = () => {
    const words = execution.title.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  const { truncate } = useTruncate();

  return (
    <Stack
      direction={"row"}
      gap={"8px"}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          bgcolor: "#375CA9",
          borderRadius: "8px",
        }}
      >
        <Typography
          color={"white"}
          fontSize={"14"}
        >
          {getInitials()}
        </Typography>

        <Box
          position={"absolute"}
          width={"10px"}
          height={"10px"}
          borderRadius={"4px 0px 8px 0px"}
          bgcolor={"surface.1"}
          bottom={0}
          right={-0.5}
        />
      </Box>
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
    // <Card
    //   onClick={handleClick}
    //   elevation={0}
    //   sx={{
    //     bgcolor: isSelected ? "primaryContainer" : "surface.3",
    //     borderRadius: "8px",
    //     p: "8px",
    //     cursor: "pointer",
    //     "&:hover, &:focus": {
    //       bgcolor: isSelected ? "primaryContainer" : "surface.5",
    //     },
    //   }}
    // >
    //   <Stack
    //     direction={"row"}
    //     alignItems={"center"}
    //     gap={1}
    //     py={"4px"}
    //   >
    //     <Tooltip
    //       title="Save"
    //       enterDelay={1000}
    //       enterNextDelay={1000}
    //     >
    //       <IconButton
    //         onClick={saveExecution}
    //         sx={{
    //           border: "none",
    //           p: "6px",
    //           "&:hover": {
    //             bgcolor: "surface.2",
    //             opacity: 1,
    //           },
    //           svg: {
    //             width: "24px",
    //             height: "24px",
    //           },
    //         }}
    //       >
    //         {execution.is_favorite ? <Bookmark /> : <BookmarkBorder />}
    //       </IconButton>
    //     </Tooltip>
    //     <Typography
    //       sx={{
    //         width: "80%",
    //         whiteSpace: "nowrap",
    //         textOverflow: "ellipsis",
    //         overflow: "hidden",
    //         fontSize: 12,
    //         fontWeight: 500,
    //         color: "onSurface",
    //       }}
    //     >
    //       {execution.title}
    //     </Typography>
    //   </Stack>
    //   <Box
    //     sx={{
    //       bgcolor: "surface.1",
    //       p: "16px 12px",
    //       borderRadius: "10px",
    //       height: "15svh",
    //       overflow: "hidden",
    //     }}
    //   >
    //     <Typography sx={{ fontSize: 14, fontWeight: 500, color: "onSurface", py: "12px" }}>
    //       {execution.title}
    //     </Typography>
    //     <Typography
    //       sx={{ fontSize: 12, fontWeight: 400, color: "onSurface" }}
    //       dangerouslySetInnerHTML={{
    //         __html: sanitizeHTML(content),
    //       }}
    //     />
    //   </Box>
    // </Card>
  );
};
