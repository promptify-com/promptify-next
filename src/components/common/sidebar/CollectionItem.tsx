import { ITemplate } from "@/common/types/template";
import {
  CardMedia,
  Grid,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";

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
          mx: expanded ? 1 : 0.5,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: 1,
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
        <Grid
          display={"flex"}
          flexDirection={"column"}
          sx={{ opacity: expanded ? 1 : 0 }}
        >
          <Typography>{template.title}</Typography>
          <Typography variant="body2" color={"text.secondary"}>
            ChatGpt
          </Typography>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
