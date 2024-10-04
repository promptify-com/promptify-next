import { MenuItem } from "@mui/material";

interface Props {
  setOpen: (value: boolean) => void;
  setOpenRemoveDialog: (value: boolean) => void;
}

function RemoveWorkflow({ setOpenRemoveDialog, setOpen }: Props) {
  const handleOpenModal = () => {
    setOpen(false);
    setOpenRemoveDialog(true);
  };

  return (
    <MenuItem
      sx={menuItemStyle}
      onClick={handleOpenModal}
    >
      Remove AI App
    </MenuItem>
  );
}

export default RemoveWorkflow;

const menuItemStyle = {
  color: "#000",
  fontSize: "13px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "150%",
  transition: "all 0.3s ease",
  "&:hover": {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    borderRadius: "100px",
    background: "#FFE1E1",
  },
};
