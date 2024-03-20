import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapsible from "@/components/sidebar/Collapsible";
import Storage from "@/common/storage";
import type { Item } from "@/components/sidebar/Collapsible";
import { useEffect } from "react";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import { setSelectedEngine, setSelectedTag, deleteSelectedTag, setSelectedEngineType } from "@/core/store/filtersSlice";
import type { Engine, Tag } from "@/core/api/dto/templates";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { setDocumentsStatus } from "@/core/store/documentsSlice";
import Bolt from "@mui/icons-material/Bolt";
import Campaign from "@mui/icons-material/Campaign";
import FilterHdr from "@mui/icons-material/FilterHdr";
import Videocam from "@mui/icons-material/Videocam";

const contentTypeItems: Item[] = [
  { id: 1, name: "Text", icon: <Bolt /> },
  { id: 2, name: "Image", icon: <FilterHdr /> },
  { id: 3, name: "Video", icon: <Videocam /> },
  { id: 4, name: "Audio", icon: <Campaign /> },
];

function StatusFilter() {
  const dispatch = useAppDispatch();

  const status = useAppSelector(state => state.documents.status);

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
  const { data: tags } = useGetTagsPopularQuery();
  const { data: engines } = useGetEnginesQuery();
  const { tag, engine, engineType } = useAppSelector(state => state.filters);

  useEffect(() => {
    const storedEngine = Storage.get("engineFilter") || null;
    const storedTags = Storage.get("tagFilter") || [];
    const storedEngineType = Storage.get("engineTypeFilter") || "";

    if (storedEngine) {
      dispatch(setSelectedEngine(storedEngine));
    }

    if (storedTags.length > 0) {
      storedTags.forEach((tag: Tag) => {
        dispatch(setSelectedTag(tag));
      });
    }

    if (storedEngineType) {
      dispatch(setSelectedEngineType(storedEngineType));
    }
  }, []);

  const handleEngineSelect = (selectedEngine: Engine) => {
    if (selectedEngine.id === engine?.id) {
      dispatch(setSelectedEngine(null));
    } else {
      dispatch(setSelectedEngine(selectedEngine));
    }
  };

  const handleTagSelect = (selectedTag: Tag) => {
    const tagExists = tag.some(tagItem => tagItem.id === selectedTag.id);

    if (tagExists) {
      dispatch(deleteSelectedTag(selectedTag.id));
    } else {
      dispatch(setSelectedTag(selectedTag));
    }
  };

  const handleEngineTypeSelect = (item: Item) => {
    dispatch(setSelectedEngineType(item.name));
  };

  const isSelected = (item: Item) => item.name === engineType;

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
        isSelected={isSelected}
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
