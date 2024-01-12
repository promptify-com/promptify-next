import { stripTags } from "@/common/helpers";
import { formatDate, timeAgo } from "@/common/helpers/timeManipulation";
import ClientOnly from "@/components/base/ClientOnly";
import { Templates } from "@/core/api/dto/templates";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { CardMedia, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

interface TemplateDetailsProps {
  template: Templates;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { palette } = useTheme();

  const titleStyle = {
    fontSize: 12,
    fontWeight: 500,
    textTransform: "uppercase",
    color: palette.primary.main,
  };
  const detailsStyle = {
    fontSize: 12,
    lineHeight: "17.16px",
    letterSpacing: "0.17px",
    fontWeight: 400,
    color: "grey.500",
    span: {
      color: "onSurface",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <Stack
      gap={2}
      width={{ md: "300px" }}
      p={"24px"}
      mb={"80px"}
    >
      <CardMedia
        sx={{
          width: "100%",
          height: "212px",
          objectFit: "cover",
          borderRadius: "48px",
        }}
        component="img"
        image={template.thumbnail}
        alt={template.title}
      />
      <Typography
        fontSize={13}
        fontWeight={400}
        color={"onSurface"}
      >
        {stripTags(template.description)}
      </Typography>

      <Stack gap={1}>
        <Typography sx={titleStyle}>TAGS</Typography>
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          gap={1}
        >
          {template.tags?.length > 0 &&
            template.tags.map(tag => (
              <Chip
                key={tag.id}
                onClick={() => {
                  dispatch(setSelectedTag(tag));
                  router.push("/explore");
                }}
                variant={"filled"}
                label={tag.name}
                sx={{
                  fontSize: 13,
                  fontWeight: 400,
                  bgcolor: "surface.3",
                  color: "onSurface",
                  p: "3px 0",
                  height: "auto",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              />
            ))}
        </Stack>
      </Stack>

      <Stack gap={1}>
        <Typography sx={titleStyle}>METRICS OVERVIEW</Typography>
        <Stack gap={1}>
          {template.last_run && (
            <ClientOnly>
              <Typography sx={detailsStyle}>
                Last run: <span>{template.last_run ? timeAgo(template.last_run) : "--"}</span>
              </Typography>
            </ClientOnly>
          )}
          <Typography sx={detailsStyle}>
            Updated: <span>{formatDate(template.updated_at)}</span>
          </Typography>
          <Typography sx={detailsStyle}>
            Created: <span>{formatDate(template.created_at)}</span>
          </Typography>
          <Typography sx={detailsStyle}>
            Views: <span>{template.views}</span>
          </Typography>
          <Typography sx={detailsStyle}>
            Runs: <span>{template.executions_count}</span>
          </Typography>
          <Typography sx={detailsStyle}>
            Created by: <span>{template.created_by.username}</span>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TemplateDetails;
