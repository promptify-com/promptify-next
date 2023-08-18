import { FC } from "react";
import { Box, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import DraftSpark from "@/assets/icons/DraftSpark";
import SavedSpark from "@/assets/icons/SavedSpark";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import useTruncate from "@/hooks/useTruncate";
import { Execution, TemplateExecutionsDisplay } from "@/core/api/dto/templates";

interface SparksLayoutMobileProps {
  execution: Execution;
  template: TemplateExecutionsDisplay;
}

export const SparksLayoutMobile: FC<SparksLayoutMobileProps> = ({ execution, template }) => {
  const { truncate } = useTruncate();
  const { convertedTimestamp } = useTimestampConverter();
  return (
    <Grid
      container
      display={{ xs: "flex", md: "none" }}
      gap={"16px"}
      bgcolor={"surface.1"}
      justifyContent={"space-between"}
    >
      <Grid
        item
        display={"flex"}
        gap={1}
        alignItems={"center"}
        position={"relative"}
        overflow={"hidden"}
      >
        <CardMedia
          sx={{
            zIndex: 1,
            borderRadius: "16px",
            width: "90px",
            height: "68px",
            objectFit: "cover",
          }}
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />
        <Box
          position={"absolute"}
          bottom={"-1px"}
          left={"-1px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"24px"}
          padding={"8px"}
          borderRadius={"16px"}
          height={"24px"}
          bgcolor={"surface.1"}
          sx={{
            zIndex: 3,
          }}
        >
          {execution.is_favorite ? (
            <SavedSpark
              width={24}
              height={24}
            />
          ) : (
            <DraftSpark
              width={24}
              height={24}
            />
          )}
        </Box>
      </Grid>
      <Grid
        item
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        gap={"4px"}
      >
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"22.88px"}
          letterSpacing={"0.17px"}
        >
          {truncate(execution.title, { length: 40 })}
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"16.8px"}
          letterSpacing={"0.15px"}
        >
          {truncate(template.title, { length: 40 })}
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={400}
          color={"onSurface"}
          lineHeight={"17.16px"}
          letterSpacing={"0.17px"}
          sx={{ opacity: 0.5 }}
        >
          {convertedTimestamp(execution.created_at)}
        </Typography>
      </Grid>
      <Grid item>
        <IconButton
          size="small"
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
          }}
        >
          <MoreVert sx={{ fontSize: "16px" }} />
        </IconButton>
      </Grid>
    </Grid>
  );
};
