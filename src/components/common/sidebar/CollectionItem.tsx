import { ICollection } from "@/common/types/collection";
import { ITemplate } from "@/common/types/template";
import { Card, CardMedia, ListItem, ListItemButton } from "@mui/material";

interface CollectionItemProps {
  expanded?: boolean;
  template: ITemplate;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({
  expanded,
  template,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={{
          minHeight: 48,
          mx: 1,
          borderRadius: "8px",
        }}
        selected={template.id == 3}
      >
        <CardMedia
          sx={{
            zIndex: 1,
            borderRadius: "16px",
            width: "50px",
            height: "50px",
            objectFit: "cover",
          }}
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />
      </ListItemButton>
    </ListItem>
  );
};
