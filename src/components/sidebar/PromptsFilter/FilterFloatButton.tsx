import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import FilterIcon from "@/components/sidebar/PromptsFilter/Icons/Filter";
import { countSelectedFilters, resetFilters } from "@/core/store/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import Storage from "@/common/storage";

function FilterFloatButton({ expanded = false }) {
  const dispatch = useAppDispatch();

  const [isHovered, setIsHovered] = useState(false);
  const filters = useAppSelector(state => state.filters);

  const filterCount = countSelectedFilters(filters);

  const handleClose = () => {
    dispatch(resetFilters());
    setIsHovered(false);
    dispatch(setStickyPromptsFilters(false));
    Storage.set("isPromptsFiltersSticky", JSON.stringify(false));
  };

  if (filterCount === 0) {
    return null;
  }

  return (
    <Box
      width={"64px"}
      height={"64px"}
      borderRadius={"16px"}
      bgcolor={"primaryContainer"}
      sx={{
        position: "fixed",
        bottom: "72px",
        left: expanded ? "410px" : "140px",
        zIndex: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <>
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
              onClick={handleClose}
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
        <FilterIcon />
      </>
    </Box>
  );
}

export default FilterFloatButton;
