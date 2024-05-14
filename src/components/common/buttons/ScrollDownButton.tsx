import { useAppSelector } from "@/hooks/useStore";
import South from "@mui/icons-material/South";
import IconButton from "@mui/material/IconButton";

export const ScrollDownButton = ({ sticky = false, onClick }: { sticky?: boolean; onClick: () => void }) => {
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  return (
    <IconButton
      onClick={onClick}
      sx={{
        transform: "translateX(-50%)",
        height: "30px",
        width: "30px",
        position: sticky ? "sticky" : "fixed",
        left: isChatHistorySticky ? "60%" : "50%",
        bottom: "125px",
        zIndex: 999,
        bgcolor: "surface.3",
        color: "onSurface",
        boxShadow: "0px 4px 8px 0px #E1E2EC, 0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
        border: "none",
        ":hover": {
          bgcolor: "surface.4",
          color: "onSurface",
        },
      }}
    >
      <South sx={{ fontSize: 16 }} />
    </IconButton>
  );
};

export default ScrollDownButton;
