import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CardDocument from "./GPTCardDocument";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useGetGPTDocumentsQuery, useUpdateGPTDocumentMutation } from "@/core/api/workflows";
import { memo, useEffect, useState } from "react";
import { IGPTDocumentResponse } from "../Automation/types";
import GPTDocumentPage from "./GPTDocumentPage";

function GPTDocumentsContainer() {
  const [selectedGPT, setSelectedGPT] = useState<IGPTDocumentResponse | null>(null);
  const [newGPts, setNewGPTs] = useState<IGPTDocumentResponse[]>([]);
  const { data = [], isLoading } = useGetGPTDocumentsQuery();
  const [updateGPTDocument] = useUpdateGPTDocumentMutation();

  useEffect(() => {
    if (data.length) {
      setNewGPTs(data);
    }
  }, [data, isLoading]);

  const onUpdateHandler = (title: string, gptKey: string) => {
    const _gpt = newGPts.find(gpt => `${gpt.id}_${gpt.created_at}` === gptKey);

    if (_gpt) {
      setNewGPTs(prevGPTs => prevGPTs.map(gpt => (`${gpt.id}_${gpt.created_at}` === gptKey ? { ...gpt, title } : gpt)));
      updateGPTDocument({
        workflowDbId: _gpt.id,
        data: {
          title,
        },
      });
    }
  };

  return (
    <Stack gap={{ xs: 2, md: 3 }}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        p={"8px 16px"}
      >
        <Typography
          fontSize={{ xs: 24, md: 32 }}
          fontWeight={400}
        >
          AI Apps documents
        </Typography>
      </Stack>
      <Grid
        container
        rowGap={2}
        px={{ xs: "16px", md: 0 }}
      >
        {isLoading ? (
          <Stack
            direction={"row"}
            flexWrap={"wrap"}
          >
            <CardDocumentTemplatePlaceholder
              count={5}
              sx={{
                height: { xs: 315, md: 331 },
                width: { xs: "95%", md: 350 },
                p: "8px",
              }}
            />
          </Stack>
        ) : newGPts.length ? (
          newGPts.map(gpt => (
            <Grid
              key={`${gpt.id}_${gpt.created_at}`}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
            >
              <CardDocument
                gpt={gpt}
                onClick={e => {
                  e.preventDefault();
                  setSelectedGPT(gpt);
                }}
              />
            </Grid>
          ))
        ) : (
          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              m: "80px 0",
              width: "100%",
              opacity: 0.7,
              fontSize: 14,
              fontWeight: 400,
              color: "onSurface",
            }}
          >
            No AI Apps document found
          </Stack>
        )}
      </Grid>
      {selectedGPT && (
        <GPTDocumentPage
          gpt={selectedGPT}
          onClose={() => setSelectedGPT(null)}
          onUpdate={onUpdateHandler}
        />
      )}
    </Stack>
  );
}

export default memo(GPTDocumentsContainer);
