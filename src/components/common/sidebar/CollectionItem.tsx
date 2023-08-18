import { ITemplate } from "@/common/types/template";
import {
  CardMedia,
  Grid,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import Image from "@/components/design-system/Image";

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
  const router = useRouter();
  const slug = router.query?.slug;
  const truncatedTilte = (str: string) => {
    if (str.length > 22) {
      return str.slice(0, 22) + "...";
    }
    return str;
  };
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
          gap: "8px",
          p: "8px",
          width: "100%",
        }}
        selected={template.slug == slug}
      >
        <Grid>
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              width: expanded ? "48px" : "38px",
              height: "38px",
              mx: expanded ? 0 : 1.5,
            }}
          >
            <Image src={template.thumbnail} alt={template.title} style={{borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%"}}/>
          </CardMedia>
        </Grid>
        <Grid display={expanded ? "flex" : "none"} flexDirection={"column"}>
          <Typography
            fontSize={12}
            fontWeight={500}
            lineHeight={"16.8px"}
            letterSpacing={"0.15px"}
            whiteSpace={"pre-wrap"}
          >
            {template.title}
          </Typography>
          <Typography
            fontSize={12}
            fontWeight={500}
            lineHeight={"16.8px"}
            variant="body2"
            letterSpacing={"0.25px"}
            color={"text.secondary"}
          >
            {truncatedTilte(template.category.name)}
          </Typography>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
