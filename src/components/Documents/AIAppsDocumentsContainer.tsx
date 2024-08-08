import Stack from "@mui/material/Stack";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Grid from "@mui/material/Grid";
import { initialState as initialDocumentsState } from "@/core/store/documentsSlice";
import { useState } from "react";
import GPTCardDocument from "./GPTCardDocument";
import GPTDocumentPage from "./GPTDocumentPage";
import { IGPTDocumentResponse } from "../Automation/types";
import { useUpdateGPTDocumentMutation } from "@/core/api/workflows";

interface Props {
  executions: IGPTDocumentResponse[] | undefined;
  isLoading: boolean;
}

export default function AIAppsDocumentsContainer({ gpts = [], isLoading }: Props) {
  const [selectedGPT, setSelectedGPT] = useState<IGPTDocumentResponse | null>(null);
  const [newGPts, setNewGPTs] = useState<IGPTDocumentResponse[]>([]);

  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const [updateGPTDocument] = useUpdateGPTDocumentMutation();

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
        ) : executions.length ? (
          executions.map(execution => (
            <Grid
              key={execution.id}
              item
              xs={12}
              sm={6}
              md={isDocumentsFiltersSticky ? 8 : 6}
              lg={isDocumentsFiltersSticky ? 6 : 4}
              xl={3}
            >
              <GPTCardDocument
                gpt={execution as any}
                onClick={e => {
                  e.preventDefault();
                  setSelectedGPT(execution);
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
            No AI App found
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
