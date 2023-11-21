import React, { useEffect, useRef, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Templates } from "@/core/api/dto/templates";
import { ExecutionCard } from "./ExecutionCard";
import { DisplayActions } from "./DisplayActions";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { SparkExportPopup } from "../dialog/SparkExportPopup";
import { isDesktopViewPort } from "@/common/helpers";
import GeneratedExecutionFooter from "./GeneratedExecutionFooter";
import { useAppSelector } from "@/hooks/useStore";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FeedbackThumbs from "./FeedbackThumbs";
import { Replay } from "@mui/icons-material";

interface Props {
  templateData: Templates;
}

export const Display: React.FC<Props> = ({ templateData }) => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [openExportPopup, setOpenExportpopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktopView = isDesktopViewPort();
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = {
    id: 123,
    created_at: new Date(),
    data: [
      {
        isLoading: false,
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed quam a sem ornare varius. Nunc consequat facilisis eleifend. Suspendisse eu ligula in libero molestie faucibus. Aliquam nec quam vitae magna congue congue. Aliquam finibus eros non laoreet malesuada. Nullam iaculis sagittis elit, ut gravida neque ornare non. Phasellus laoreet ultrices erat, sed lobortis turpis ullamcorper vel. Suspendisse luctus lectus sit amet ante rhoncus consequat. Pellentesque feugiat elit quis libero tempus, commodo porttitor massa tincidunt. Donec dictum et urna at mattis. Integer ut condimentum purus, in condimentum velit. Aliquam finibus imperdiet maximus. Aenean magna massa, vehicula eu feugiat sed, ornare sed mauris.

      Sed maximus rutrum nisi, at tincidunt est lobortis at. Mauris iaculis, ligula id tristique lacinia, libero nunc viverra risus, ac vulputate ligula leo id risus. Etiam ornare felis mauris, sed vehicula magna gravida blandit. Aenean eu accumsan libero. Etiam nec laoreet felis. Nunc vel augue vel nisl vehicula semper at ut libero. Morbi eu nunc vel dolor efficitur viverra. Mauris augue risus, convallis eu nisi pretium, semper mattis ex. Nulla maximus erat et lectus imperdiet tincidunt. In sit amet tincidunt eros, ut vestibulum risus. Maecenas in sem magna. Nullam non eros accumsan, fringilla risus non, facilisis arcu. Fusce facilisis rutrum erat, vitae facilisis magna laoreet ut. Suspendisse nec mauris vitae felis auctor mattis. Nam id ex eget augue sagittis fermentum ac sed turpis.`,
        prompt: 1542,
        created_at: new Date(),
      },
    ],
  };
  // useAppSelector(state => state.executions.generatedExecution);
  const isFetching = useAppSelector(state => state.executions.isFetching);
  const activeExecution = useMemo(() => {
    if (selectedExecution) {
      return {
        ...selectedExecution,
        template: {
          ...selectedExecution.template,
          title: templateData.title,
          slug: templateData.slug,
          thumbnail: templateData.thumbnail,
        },
      };
    }
    return null;
  }, [selectedExecution]);
  const isGeneratedExecutionEmpty = Boolean(generatedExecution && !generatedExecution.data?.length);
  const executionIsLoading = isFetching || isGeneratedExecutionEmpty;

  // click listener to remove opacity layer on first loaded execution
  useEffect(() => {
    const handleClick = () => setFirstLoad(false);

    const container = containerRef.current;
    container?.addEventListener("click", handleClick);

    return () => container?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    // If there is a new execution being generated, remove opacity layer
    setFirstLoad(!generatedExecution);
  }, [generatedExecution]);

  const currentGeneratedPrompt = useMemo(() => {
    if (generatedExecution?.data?.length) {
      const loadingPrompt = generatedExecution.data.find(prompt => prompt.isLoading);
      const prompt = templateData.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }

    return null;
  }, [generatedExecution]);

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
    >
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          pb: { xs: "70px", md: "0" },
        }}
      >
        <Box
          sx={{
            opacity: firstLoad ? 0.5 : 1,
            bgcolor: "surface.1",
            borderRadius: "16px 16px 0px 0px",
            position: "relative",
          }}
        >
          {executionIsLoading ? (
            <ParagraphPlaceholder />
          ) : !selectedExecution && isGeneratedExecutionEmpty ? (
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              No spark found
            </Typography>
          ) : (
            <Stack flexDirection={"row"}>
              <ExecutionCard
                execution={generatedExecution ?? selectedExecution}
                promptsData={templateData.prompts}
              />
              {selectedExecution && (
                <Stack
                  gap={2}
                  position={"relative"}
                  width={"5%"}
                >
                  <Stack
                    direction={"column"}
                    alignItems={"center"}
                    position={"absolute"}
                    top={"40%"}
                    right={"-8px"}
                  >
                    <FeedbackThumbs execution={selectedExecution} />
                    <Button
                      onClick={() => {
                        console.log("replay");
                        // if (msg.spark) regenerate(msg.spark);
                      }}
                      variant="text"
                      startIcon={<Replay />}
                      sx={{
                        height: "22px",
                        width: "22px",
                        mt: "8px",
                        ":hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}
        </Box>
      </Box>
      {currentGeneratedPrompt && (
        <GeneratedExecutionFooter
          title={currentGeneratedPrompt.title}
          order={currentGeneratedPrompt.order}
          isMobile={!isDesktopView}
        />
      )}
    </Grid>
  );
};
