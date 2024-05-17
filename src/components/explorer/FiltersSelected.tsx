import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import {
  deleteSelectedTag,
  deleteSelectedEngineType,
  setSelectedEngine,
  setSelectedKeyword,
} from "@/core/store/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { Tag } from "@/core/api/dto/templates";
import usePromptsFilter from "./Hooks/usePromptsFilter";

interface FiltersSelectedProps {
  show: boolean;
}

export const FiltersSelected: React.FC<FiltersSelectedProps> = ({ show }) => {
  const dispatch = useAppDispatch();
  const { title } = useAppSelector(state => state.filters);
  const { filters, handleCheckIsFavorite, handleSelectEngine, handleSelectEngineType, handleSelectTag } =
    usePromptsFilter();
  const { engine, engineType, tag, isFavorite } = filters;

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
              onDelete={() => handleSelectEngine(null)}
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
                    onDelete={() => handleSelectTag(item)}
                  />
                ))}
            </Box>
          )}
          {engineType.length > 0 && (
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={2}
            >
              {engineType.map(item => (
                <Chip
                  key={item.id}
                  label={item.label}
                  sx={{ fontSize: 13, fontWeight: 500 }}
                  onDelete={() => handleSelectEngineType(item)}
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

          {isFavorite && (
            <Chip
              label={"My Favorites"}
              sx={{ fontSize: 13, fontWeight: 500 }}
              onDelete={() => handleCheckIsFavorite(false)}
            />
          )}
        </Box>
      )}
    </>
  );
};
