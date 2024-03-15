import { Box, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteSelectedTag,
  setMyFavoritesChecked,
  setSelectedEngine,
  setSelectedEngineType,
  setSelectedKeyword,
} from "@/core/store/filtersSlice";
import { RootState } from "@/core/store";
import { Tag } from "@/core/api/dto/templates";

interface FiltersSelectedProps {
  show: boolean;
}

export const FiltersSelected: React.FC<FiltersSelectedProps> = ({ show }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const { engine, tag, title, engineType, isFavourite } = filters;
  const handleDeleteTag = (tagId: number) => {
    dispatch(deleteSelectedTag(tagId));
  };

  return (
    <>
      {show && (
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={2}
          sx={{
            p: {
              xs: "20px",
              md: "0 16px",
            },
          }}
        >
          {engine && (
            <Chip
              label={engine.name}
              sx={{ fontSize: 13, fontWeight: 500 }}
              onDelete={() => dispatch(setSelectedEngine(null))}
            />
          )}
          {tag.length > 0 && (
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={2}
            >
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
          {title && (
            <Chip
              label={title}
              sx={{ fontSize: 13, fontWeight: 500 }}
              onDelete={() => dispatch(setSelectedKeyword(null))}
            />
          )}

          {engineType && (
            <Chip
              label={engineType}
              sx={{ fontSize: 13, fontWeight: 500 }}
              onDelete={() => dispatch(setSelectedEngineType(""))}
            />
          )}
          {isFavourite && (
            <Chip
              label={"My Favorites"}
              sx={{ fontSize: 13, fontWeight: 500 }}
              onDelete={() => dispatch(setMyFavoritesChecked(false))}
            />
          )}
        </Box>
      )}
    </>
  );
};
