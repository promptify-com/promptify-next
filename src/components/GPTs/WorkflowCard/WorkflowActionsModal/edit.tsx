import { Dispatch } from "react";
// Mui
import { MenuItem } from "@mui/material";
//
import { useRouter } from "next/router";

interface Props {
  template_slug: string;
  setOpen: Dispatch<boolean>;
}

function EditWorkflow({ template_slug, setOpen }: Props) {
  const router = useRouter();
  ///
  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/apps/${template_slug}`);
    setOpen(false);
  };

  return (
    <MenuItem
      sx={menuItemStyle}
      onClick={handleEdit}
    >
      Edit AI App
    </MenuItem>
  );
}

export default EditWorkflow;

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
