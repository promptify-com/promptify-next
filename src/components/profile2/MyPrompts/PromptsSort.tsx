import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { SORTING_OPTIONS } from "@/components/profile2/Constants";

interface PromptsSortProps {
  sortAnchor: null | HTMLElement;
  sortOpen: boolean;
  setSortAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  handleSelectSort: (option: any) => void;
  sortOption: any;
}

export default function PromptsSort({
  sortAnchor,
  sortOpen,
  setSortAnchor,
  handleSelectSort,
  sortOption,
}: PromptsSortProps) {
  return (
    <Menu
      anchorEl={sortAnchor}
      open={sortOpen}
      onClose={() => setSortAnchor(null)}
      disableScrollLock
      sx={{
        ".MuiList-root": {
          p: 0,
        },
        ".MuiMenuItem-root": {
          borderTop: "1px solid #E3E3E3",
          fontSize: 14,
          fontWeight: 400,
          color: "onSurface",
        },
      }}
    >
      {SORTING_OPTIONS.map(option => (
        <MenuItem
          key={option.label}
          onClick={() => handleSelectSort(option)}
          disabled={sortOption.orderby === option.orderby}
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
