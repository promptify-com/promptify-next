import { Box, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteSelectedTag,
  setSelectedEngine,
} from "@/core/store/filtersSlice";
import { RootState } from "@/core/store";
import { Tag } from "@/core/api/dto/templates";

interface FiltersSelectedProps {
  show: boolean;
}

export const FiltersSelected: React.FC<FiltersSelectedProps> = ({ show }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const { engine, tag } = filters;

  const handleDeleteTag = (tagId: number) => {
    dispatch(deleteSelectedTag(tagId));
  };
  return (
    <>
      {show && (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          {engine && (
            <Chip
              label={engine.name}
              sx={{ fontSize: 13, fontWeight: 500 }}
              onDelete={() => dispatch(setSelectedEngine(null))}
            />
          )}
          {tag.length > 0 && (
            <Box display={"flex"} alignItems={"center"} gap={2}>
              {tag
                .filter((item: Tag | null): item is Tag => item !== null)
                .map((item: Tag) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    sx={{ fontSize: 13, fontWeight: 500 }}
                    onDelete={() => handleDeleteTag(item.id)}
                  />
                ))}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
