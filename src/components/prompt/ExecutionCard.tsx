import React from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import {
  ContentCopy,
  StarOutline as StarOutlineIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Subtitle } from "@/components/blocks";
import { getMarkdownFromString } from "@/common/helpers/getMarkdownFromString";
import moment from "moment";
import PromptifyLogo from "@/assets/images/promptify.png";
import { addToFavorite, removeFromFavorite } from "@/hooks/api/executions";
import Image from "next/image";

interface Props {
  execution: TemplatesExecutions;
  templateData: Templates;
}

export const ExecutionCard: React.FC<Props> = ({ execution, templateData }) => {
  const { palette } = useTheme();
  const [isFavorite, setIsFavorite] = React.useState(execution.is_favorite);

  const isImageOutput = (output: string): boolean => {
    return (
      output.endsWith(".png") ||
      output.endsWith(".jpg") ||
      output.endsWith(".jpeg") ||
      output.endsWith(".webp")
    );
  };

  // Function to toggle favorite status
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorite(execution.id);
      } else {
        await addToFavorite(execution.id);
      }
      setIsFavorite(!isFavorite); // Update the state
    } catch (error) {
      console.error(error);
    }
  };

  const copyFormattedOutput = async () => {
    let copyHTML = "";
    for (const exec of execution.prompt_executions) {
      const prompt = templateData.prompts.find(
        (prompt) => prompt.id === exec.prompt
      );
      if (prompt?.show_output) {
        copyHTML += "<h2>" + prompt.title + "</h2>";
        if (isImageOutput(exec.output)) {
          copyHTML += '<img src="' + exec.output + '" alt="Image output"/>';
        } else {
          copyHTML += "<p>" + exec.output + "</p>";
        }
        copyHTML += "<br/>";
      }
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([copyHTML], { type: "text/html" }),
        }),
      ]);
    } catch (err) {
      console.error("Failed to copy HTML: ", err);
    }
  };

  return (
    <Stack direction={"row"} spacing={{ xs: 0, md: 2 }} sx={{ py: "20px" }}>
      <Image
        src={PromptifyLogo}
        alt={"alt"}
        style={{
          display: "inline-flex",
          width: 40,
          height: 40,
          objectFit: "cover",
          borderRadius: "50%",
          marginTop: "16px",
        }}
      />
      <Box
        sx={{
          flex: 1,
          borderRadius: "16px",
          bgcolor: alpha(palette.surface[4], 0.6),
          p: "16px",
          width: "calc(100% - 32px)",
        }}
      >
        <Stack direction={"row"} alignItems={"center"} gap={1} mb={"20px"}>
          <Image
            src={PromptifyLogo}
            alt={"alt"}
            style={{
              display: "inline-flex",
              width: 24,
              height: 24,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <Typography fontSize={12} fontWeight={500} color={"onSurface"}>
            Promptify
          </Typography>
          <Typography fontSize={12} fontWeight={500} color={"grey.600"}>
            {moment(execution.created_at).fromNow()}
          </Typography>
        </Stack>

        {execution.prompt_executions.map((exec) => {
          const prompt = templateData.prompts.find(
            (prompt) => prompt.id === exec.prompt
          );
          if (prompt?.show_output)
            return (
              <Box key={exec.id} sx={{ mb: "30px" }}>
                <Subtitle sx={{ mb: "12px", color: "tertiary", fontSize: 12 }}>
                  {prompt.title}
                </Subtitle>
                {isImageOutput(exec.output) ? (
                  <Box
                    component={"img"}
                    alt={"book cover"}
                    src={exec.output}
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      (e.target as HTMLImageElement).src =
                        "http://placehold.it/165x215";
                    }}
                    sx={{
                      borderRadius: "8px",
                      width: 165,
                      height: 215,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "onSurface",
                      fontSize: 14,
                      wordWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: getMarkdownFromString(exec.output),
                    }}
                  />
                )}
              </Box>
            );
        })}

        <Stack
          direction={"row"}
          spacing={2}
          sx={{
            mt: "20px",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <IconButton
            style={cardButton}
            sx={{
              flexDirection: { xs: "column", md: "row" },
              bgcolor: "surface.1",
              color: "onSurface",
              ":hover": { bgcolor: "action.hover", color: "onSurface" },
              svg: { width: "24px", height: "24px" },
            }}
            onClick={toggleFavorite}
          >
            {isFavorite ? <StarIcon /> : <StarOutlineIcon />} Fav
          </IconButton>
          <IconButton
            style={cardButton}
            sx={{
              flexDirection: { xs: "column", md: "row" },
              bgcolor: "surface.1",
              color: "onSurface",
              ":hover": { bgcolor: "action.hover", color: "onSurface" },
              svg: { width: "24px", height: "24px" },
            }}
            onClick={copyFormattedOutput}
          >
            <ContentCopy /> Copy
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
};

const cardButton = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  border: "none",
  borderRadius: "16px",
  padding: "15px",
  fontSize: 12,
  gap: 10,
};
