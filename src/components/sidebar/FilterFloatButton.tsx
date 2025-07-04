import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, useTheme } from "@mui/material/styles";
import FilterIcon from "@/components/sidebar/PromptsFilter/Icons/Filter";

interface Props {
  expanded: boolean;
  onClick: () => void;
  onClose?: () => void;
  count: number;
}

function FilterFloatButton({ expanded, onClick, onClose, count }: Props) {
  const theme = useTheme();

  const [isHovered, setIsHovered] = useState(false);
  const [isCrossHovered, setIsCrossHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      width={"64px"}
      height={"64px"}
      borderRadius={"16px"}
      bgcolor={"primaryContainer"}
      sx={{
        position: "fixed",
        cursor: "pointer",
        bottom: "72px",
        left: { xs: "82svw", md: expanded ? "410px" : "120px" },
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
        {count !== 0 && (
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
                  setIsHovered(false);
                  onClose?.();
                }}
              />
            ) : (
              <Typography
                fontSize={"12px"}
                color={"onPrimary"}
              >
                {count}
              </Typography>
            )}
          </Box>
        )}

        <FilterIcon fill={isHovered ? theme.palette.common.white : "#032100"} />
      </>
    </Box>
  );
}

export default FilterFloatButton;
