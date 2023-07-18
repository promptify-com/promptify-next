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
  onClick: () => void;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({
  expanded,
  template,
  onClick,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
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
          <Typography
            fontSize={12}
            fontWeight={500}
            lineHeight={"16.8px"}
            letterSpacing={"0.15px"}
          >
            {template.title}
          </Typography>
          <Typography
            fontSize={10}
            fontWeight={500}
            lineHeight={"12.35px"}
            variant="body2"
            letterSpacing={"0.25px"}
            color={"text.secondary"}
          >
            {template.category.name}
          </Typography>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
