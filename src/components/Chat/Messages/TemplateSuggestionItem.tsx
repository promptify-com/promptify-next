import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";
import ElectricBolt from "@mui/icons-material/ElectricBolt";
import Image from "@/components/design-system/Image";
import type { Templates } from "@/core/api/dto/templates";
import TemplateActions from "@/components/Chat/TemplateActions";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedTemplate, setAnswers } from "@/core/store/chatSlice";

interface Props {
  template: Templates;
  onScrollToBottom: () => void;
}

function TemplateSuggestionItem({ template, onScrollToBottom }: Props) {
  const dispatch = useAppDispatch();
  const { thumbnail, title, slug, description, favorites_count, executions_count } = template;

  const handleRunPrompt = () => {
    dispatch(setSelectedTemplate(template));
    dispatch(setAnswers([]));
    setTimeout(() => {
      onScrollToBottom();
    }, 100);
  };

  return (
    <Stack
      bgcolor={"surface.1"}
      p={"16px 0px"}
      px={{ xs: "8px", md: "16px" }}
      borderRadius={"24px"}
      direction={{ xs: "column", md: "row" }}
      gap={"24px"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"24px"}
      >
        <Box
          component={Link}
          href={`/prompt/${slug}`}
          target="_blank"
          sx={{
            zIndex: 0,
            position: "relative",
            width: { xs: "260px", md: "152px" },
            minWidth: "152px",
            height: "113px",
            borderRadius: "24px",
            overflow: "hidden",
            textDecoration: "none",
          }}
        >
          <Image
            src={thumbnail}
            alt={"Image 1"}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
        <Stack
          direction={"column"}
          justifyItems={"flex-start"}
          gap={2}
        >
          <Stack alignItems={"flex-start"}>
            <Link
              href={`/prompt/${slug}`}
              target="_blank"
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                fontSize={{ xs: 15, md: 18 }}
                fontWeight={500}
                lineHeight={"25.2px"}
              >
                {title}
              </Typography>
            </Link>
            <Typography
              fontSize={{ xs: 14, md: 16 }}
              fontWeight={400}
              lineHeight={"22.2px"}
              sx={{
                opacity: 0.75,
              }}
            >
              {description}
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            gap={"8px"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
            >
              <Favorite
                sx={{
                  fontSize: "14px",
                  mr: "2px",
                }}
              />
              <Typography
                fontSize={13}
                fontWeight={400}
                lineHeight={"18.2px"}
              >
                {favorites_count}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
            >
              <ElectricBolt
                sx={{
                  fontSize: "14px",
                  mr: "2px",
                }}
              />

              <Typography
                fontSize={13}
                fontWeight={400}
                lineHeight={"18.2px"}
              >
                {executions_count}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        px={{ md: "30px" }}
        width={{ xs: "100%", md: "fit-content" }}
      >
        <Button
          variant="text"
          startIcon={<PlayArrow />}
          sx={{
            color: "onSurface",
            width: { xs: "100%", md: "fit-content" },
            bgcolor: { xs: "surfaceContainerLow", md: "transparent" },
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          onClick={handleRunPrompt}
        >
          Run prompt
        </Button>
        <TemplateActions
          template={template}
          onScrollToBottom={onScrollToBottom}
        />
      </Stack>
    </Stack>
  );
}

export default TemplateSuggestionItem;
