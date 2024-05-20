import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapsible from "@/components/sidebar/Collapsible";
import type { Item } from "@/components/sidebar/Collapsible";
import type { Engine } from "@/core/api/dto/templates";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { setDocumentsContentTypes, setDocumentsEngine, setDocumentsStatus } from "@/core/store/documentsSlice";
import EnginesSelect from "@/components/sidebar/EnginesSelect";
import { contentTypeItems } from "@/components/sidebar/Constants";
import { initialState as initialDocumentsState } from "@/core/store/documentsSlice";

function StatusFilter() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.documents?.filter?.status ?? null);

  return (
    <Box>
      <Typography
        fontSize={14}
        fontWeight={500}
        color={"onSurface"}
        p={"16px 8px"}
      >
        Status
      </Typography>
      <Box px={"8px"}>
        <Stack
          direction={"row"}
          gap={1}
          sx={{
            p: "4px",
            bgcolor: "surfaceContainerHigh",
            borderRadius: "999px",
          }}
        >
          <Button
            onClick={() => dispatch(setDocumentsStatus(null))}
            sx={{
              ...navBtnStyle,
              ...(!status && { bgcolor: "secondary.main", color: "onSecondary" }),
            }}
          >
            All
          </Button>
          <Button
            onClick={() => dispatch(setDocumentsStatus("draft"))}
            sx={{
              ...navBtnStyle,
              ...(status === "draft" && { bgcolor: "secondary.main", color: "onSecondary" }),
            }}
          >
            Drafts
          </Button>
          <Button
            onClick={() => dispatch(setDocumentsStatus("saved"))}
            sx={{
              ...navBtnStyle,
              ...(status === "saved" && { bgcolor: "secondary.main", color: "onSecondary" }),
            }}
          >
            Saved
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function DocumentsFilters() {
  const dispatch = useAppDispatch();
  const { engine, contentTypes } = useAppSelector(state => state.documents?.filter ?? initialDocumentsState.filter);

  const handleEngineSelect = (selectedEngine: Engine | null) => {
    dispatch(setDocumentsEngine(selectedEngine));
  };

  const isTypeSelected = (item: Item) => !!contentTypes.find(type => type.label === item.name);

  const handleEngineTypeSelect = (item: Item) => {
    const types = isTypeSelected(item)
      ? contentTypes.filter(type => type.label !== item.name)
      : contentTypes.concat({ id: item.id, label: item.name });
    dispatch(setDocumentsContentTypes(types));
  };

  return (
    <Stack
      gap={2}
      py={"16px"}
    >
      <StatusFilter />
      <Collapsible
        title="Content type"
        items={contentTypeItems}
        onSelect={handleEngineTypeSelect}
        isSelected={isTypeSelected}
      />
      <EnginesSelect
        value={engine}
        onSelect={handleEngineSelect}
      />
    </Stack>
  );
}

export default DocumentsFilters;

const navBtnStyle = {
  flex: 1,
  borderRadius: "99px",
  p: "8xp 16px",
  color: "onSurface",
  ":hover": {
    bgcolor: "action.hover",
    color: "onSurface",
  },
};
