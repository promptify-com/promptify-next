import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyPromptsReviewFilters } from "@/core/store/sidebarSlice";
import { LocalStorage } from "@/common/storageTemp";
import FilterIcon from "@/components/sidebar/PromptsFilter/Icons/Filter";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

function PromptsReviewFloatButton({ expanded = false }) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const isPromptsReviewFiltersSticky = useAppSelector(state => state.sidebar.isPromptsReviewFiltersSticky);
  const { resetFilters, filtersCount } = usePromptsFilter();

  const [isHovered, setIsHovered] = useState(false);
  const [isCrossHovered, setIsCrossHovered] = useState(false);

  return (
    <Box
      onClick={() => dispatch(setStickyPromptsReviewFilters(!isPromptsReviewFiltersSticky))}
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
        {filtersCount !== 0 && (
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
              cursor: isCrossHovered ? "pointer" : "inherit",
            }}
            onMouseEnter={() => setIsCrossHovered(true)}
            onMouseLeave={() => setIsCrossHovered(false)}
          >
            {isCrossHovered ? (
              <CloseIcon
                style={{ color: "white", fontSize: 16 }}
                onClick={event => {
                  event.stopPropagation();
                  resetFilters();
                  setIsHovered(false);
                  dispatch(setStickyPromptsReviewFilters(false));
                  LocalStorage.set("isPromptsReviewFiltersSticky", JSON.stringify(false));
                }}
              />
            ) : (
              <Typography
                fontSize={"12px"}
                color={"onPrimary"}
              >
                {filtersCount}
              </Typography>
            )}
          </Box>
        )}

        <FilterIcon fill={isHovered ? theme.palette.common.white : "#032100"} />
      </>
    </Box>
  );
}

export default PromptsReviewFloatButton;
