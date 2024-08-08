import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import CardDocument from "./CardDocument";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Grid from "@mui/material/Grid";
import { updatePopupTemplate } from "@/core/store/templatesSlice";
import { getTemplateById } from "@/hooks/api/templates";
import TemplateDocumentModal from "@/components/Prompt/TemplateDocumentModal";
import { initialState as initialDocumentsState } from "@/core/store/documentsSlice";

interface Props {
  executions: ExecutionWithTemplate[] | undefined;
  isLoading: boolean;
}

export default function DocumentsContainer({ executions = [], isLoading }: Props) {
  const dispatch = useAppDispatch();
  const filterTemplate = useAppSelector(
    state => state.documents?.filter?.template ?? initialDocumentsState.filter.template,
  );
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const handleOpenDocument = async (execution: ExecutionWithTemplate) => {
    let template = execution.template;
    if (!template?.prompts && template?.id) {
      // TODO: update execution template in executions state and avoid refetch
      template = await getTemplateById(template.id);
    }
    dispatch(
      updatePopupTemplate({
        data: { ...execution, template },
      }),
    );
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
        {!filterTemplate && (
          <Typography
            fontSize={{ xs: 24, md: 32 }}
            fontWeight={400}
          >
            Templates Generated Content
          </Typography>
        )}
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
              <CardDocument
                execution={execution}
                onClick={e => {
                  e.preventDefault();
                  handleOpenDocument(execution);
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
            No document found
          </Stack>
        )}
      </Grid>
      <TemplateDocumentModal />
    </Stack>
  );
}
