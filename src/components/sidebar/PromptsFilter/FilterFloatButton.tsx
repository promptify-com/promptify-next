import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from "@mui/material/styles";

import { theme } from "@/theme";
import { countSelectedFilters, resetFilters } from "@/core/store/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import Storage from "@/common/storage";
import FilterIcon from "@/components/sidebar/PromptsFilter/Icons/Filter";

function FilterFloatButton({ expanded = false }) {
  const dispatch = useAppDispatch();

  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const filters = useAppSelector(state => state.filters);

  const [isHovered, setIsHovered] = useState(false);

  const filterCount = countSelectedFilters(filters);

  return (
    <Box
      onClick={() => dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky))}
      width={"64px"}
      height={"64px"}
      borderRadius={"16px"}
      bgcolor={"primaryContainer"}
      sx={{
        position: "fixed",
        cursor: "pointer",
        bottom: "72px",
        left: expanded ? "410px" : "120px",
        zIndex: 1220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ":hover": { bgcolor: alpha(theme.palette.primary.main, 0.4) },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <>
        {filterCount !== 0 && (
          <Box
            position={"absolute"}
            top={0}
            right={0}
            bgcolor={"primary.main"}
            width={"28px"}
            height={"28px"}
            borderRadius={"28px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              cursor: isHovered ? "pointer" : "inherit",
            }}
          >
            {isHovered ? (
              <CloseIcon
                style={{ color: "white", fontSize: 16 }}
                onClick={event => {
                  event.stopPropagation();
                  dispatch(resetFilters());
                  setIsHovered(false);
                  dispatch(setStickyPromptsFilters(false));
                  Storage.set("isPromptsFiltersSticky", JSON.stringify(false));
                }}
              />
            ) : (
              <Typography
                fontSize={"12px"}
                color={"onPrimary"}
              >
                {filterCount}
              </Typography>
            )}
          </Box>
        )}

        <FilterIcon />
      </>
    </Box>
  );
}

export default FilterFloatButton;
