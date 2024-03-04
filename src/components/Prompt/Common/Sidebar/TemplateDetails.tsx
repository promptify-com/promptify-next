import { stripTags } from "@/common/helpers";
import { formatDate } from "@/common/helpers/timeManipulation";
import { Templates } from "@/core/api/dto/templates";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { Box, Button, Chip, Stack, Typography, alpha } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Image from "@/components/design-system/Image";
import { theme } from "@/theme";
import FavoriteIcon from "@/components/Prompt/FavoriteIcon";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import RunButton from "@/components/Prompt/RunButton";

interface TemplateDetailsProps {
  template: Templates;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Stack
      gap={3}
      width={{ md: "430px" }}
      height={"100%"}
      overflow={"auto"}
    >
      <Stack
        gap={6}
        p={"48px 40px 24px"}
      >
        <Stack gap={3}>
          <Typography
            fontSize={24}
            fontWeight={500}
            color={"onSurface"}
          >
            {template.title}
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <Image
              src={template.created_by.avatar ?? require("@/assets/images/default-avatar.jpg")}
              alt={template.created_by.first_name?.slice(0, 1) ?? "P"}
              width={32}
              height={32}
              style={{
                backgroundColor: theme.palette.surface[5],
                borderRadius: "50%",
              }}
            />
            <Typography
              fontSize={13}
              fontWeight={400}
              color={"onSurface"}
            >
              by {template.created_by.first_name || template.created_by.username}
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            gap={1}
          >
            <FavoriteIcon
              style={{
                sx: iconBtnStyle,
              }}
            />
            <Button
              onClick={() => {}}
              startIcon={template.is_favorite ? <Bookmark /> : <BookmarkBorder />}
              sx={iconBtnStyle}
            >
              {template.is_favorite ? "Remove" : "Save"}
            </Button>
          </Stack>
          <Typography
            fontSize={16}
            fontWeight={400}
            color={alpha(theme.palette.onSurface, 0.75)}
          >
            {stripTags(template.description)}
          </Typography>

          <RunButton
            title="Run prompt"
            onClick={() => {}}
            sx={{
              maxWidth: "none",
              height: "auto",
              p: "12px 16px",
            }}
          />
        </Stack>
        <Box>
          <Stack
            gap={2}
            py={"16px"}
          >
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"onSurface"}
            >
              More about this prompt:
            </Typography>
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
                      bgcolor: "surfaceContainerLow",
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
          <Stack
            gap={2}
            py={"16px"}
          >
            <Typography sx={detailsStyle}>
              Created: <span>{formatDate(template.created_at)}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Views: <span>{template.views}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Runs: <span>{template.executions_count}</span>
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default TemplateDetails;

const detailsStyle = {
  fontSize: 14,
  fontWeight: 400,
  color: alpha(theme.palette.onSurface, 0.5),
  span: {
    color: "onSurface",
  },
};
const iconBtnStyle = {
  flex: 1,
  border: "1px solid",
  borderColor: "surfaceContainerHigh",
  borderRadius: "99px",
  p: "8px 16px",
  fontSize: 14,
  fontWeight: 500,
  gap: 0.5,
  color: "onSurface",
  ":hover": {
    bgcolor: "surfaceContainerHigh",
  },
};
