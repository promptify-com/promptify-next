import { FC } from "react";
import { ArrowDropDown, CloudQueueRounded, DeleteRounded, Edit } from "@mui/icons-material";
import { Box, CardMedia, Grid, Typography } from "@mui/material";

import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import SavedSpark from "@/assets/icons/SavedSpark";
import DraftSpark from "@/assets/icons/DraftSpark";
import useTruncate from "@/hooks/useTruncate";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import BaseButton from "./base/BaseButton";

interface SparksSectionProps {
  templates: TemplateExecutionsDisplay[];
}

const SparksSection: FC<SparksSectionProps> = ({ templates }) => {
  const { truncate } = useTruncate();
  const { convertedTimestamp } = useTimestampConverter();
  return (
    <Grid>
      {templates.map(template => (
        <Box
          key={template.id}
          borderRadius={"8px"}
          overflow={"hidden"}
        >
          {template.sparks.map(spark => (
            <Grid
              key={spark.id}
              container
              bgcolor={"surface.1"}
              alignItems={"center"}
            >
              <Grid
                item
                sx={{ width: "49px" }}
                padding={"16px 8px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {spark.is_favorite ? <SavedSpark /> : <DraftSpark />}
              </Grid>
              <Grid
                item
                xs={3}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  fontSize={13}
                  fontWeight={500}
                  color={"onSurface"}
                  lineHeight={"18.59px"}
                  letterSpacing={"0.17px"}
                >
                  {truncate(spark.initial_title, { length: 40 })}
                </Typography>
                <Edit sx={{ fontSize: "16px", opacity: 0.25 }} />
              </Grid>
              <Grid
                item
                xs={4}
                padding={"16px"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <CardMedia
                  sx={{
                    zIndex: 1,
                    borderRadius: "8px",
                    width: { xs: "41px", sm: "41px" },
                    height: { xs: "73px", sm: "31px" },
                    objectFit: "cover",
                  }}
                  component="img"
                  image={template.thumbnail}
                  alt={template.title}
                />
                <Typography
                  fontSize={13}
                  fontWeight={500}
                  color={"onSurface"}
                  lineHeight={"18.59px"}
                  letterSpacing={"0.17px"}
                >
                  {truncate(template.title, { length: 40 })}
                </Typography>
              </Grid>

              <Grid
                item
                xs={2}
                padding={"16px"}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <Typography
                  fontSize={12}
                  fontWeight={400}
                  color={"onSurface"}
                  lineHeight={"17.16px"}
                  letterSpacing={"0.17px"}
                  sx={{ opacity: 0.5 }}
                >
                  {convertedTimestamp(spark.created_at)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={1}
                padding={"16px"}
                display={"flex"}
                gap={1}
                sx={{ mr: 9 }}
                alignItems={"center"}
              >
                <BaseButton
                  variant="text"
                  color="primary"
                  sx={{ opacity: 0.25 }}
                >
                  Export <ArrowDropDown sx={{ ml: 1 }} />
                </BaseButton>
              </Grid>

              <Grid
                item
                xs={1}
                padding={"16px"}
                display={"flex"}
                gap={1}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <BaseButton
                  variant="text"
                  color="primary"
                  sx={{ opacity: 0.25 }}
                >
                  <CloudQueueRounded sx={{ fontSize: "18px", mr: 0.5 }} />
                  Save
                </BaseButton>
                <DeleteRounded sx={{ opacity: 0.25, fontSize: " 16px" }} />
              </Grid>
            </Grid>
          ))}
        </Box>
      ))}
    </Grid>
  );
};

export default SparksSection;
