import { stripTags } from "@/common/helpers";
import { formatDate } from "@/common/helpers/timeManipulation";
import { Templates } from "@/core/api/dto/templates";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { Button, Chip, Stack, Typography, alpha } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Image from "@/components/design-system/Image";
import { theme } from "@/theme";
import FavoriteButton from "./FavoriteButton";
import LikeButton from "./LikeButton";
import RunButton from "@/components/Prompt/Common/RunButton";
import { useAppSelector } from "@/hooks/useStore";
import Tune from "@mui/icons-material/Tune";
import ContentCopy from "@mui/icons-material/ContentCopy";
import useCloneTemplate from "@/components/Prompt/Hooks/useCloneTemplate";
import { setSelectedTemplate } from "@/core/store/chatSlice";
import { updatePopupTemplate } from "@/core/store/templatesSlice";

interface TemplateDetailsProps {
  template: Templates;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cloneTemplate } = useCloneTemplate({ template });
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isOwner = currentUser?.is_admin || currentUser?.id === template.created_by.id;

  const handleEdit = () => {
    if (isOwner) {
      const url = `/prompt-builder/${template.slug}?editor=1`;
      window.open(url, "_blank");
      return;
    }

    cloneTemplate();
  };

  const CloneButton = () => (
    <Button
      onClick={handleEdit}
      startIcon={isOwner ? <Tune /> : <ContentCopy />}
      sx={{
        ml: "-20px",
        color: "onSurface",
        ":hover": {
          bgcolor: "surfaceContainerHigh",
        },
      }}
    >
      {isOwner ? "Edit" : "Clone & Edit"}
    </Button>
  );

  const handleRun = () => {
    if (!currentUser?.id) {
      return router.push("/signin");
    }

    dispatch(setSelectedTemplate(template));
    router.push("/chats");
    dispatch(
      updatePopupTemplate({
        template: null,
      }),
    );
  };

  return (
    <Stack
      height={{ md: "calc(100svh - 24px)" }}
      overflow={"auto"}
      sx={{
        "&::-webkit-scrollbar": {
          width: 0,
        },
      }}
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
            <LikeButton
              style={{
                sx: { flex: 1 },
              }}
            />
            <FavoriteButton
              style={{
                sx: { flex: 1 },
              }}
            />
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
            onClick={handleRun}
            sx={{
              maxWidth: "none",
              height: "auto",
              p: "12px 16px",
            }}
          />
        </Stack>
        <Stack alignItems={"flex-start"}>
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
          <Stack
            gap={2}
            py={"16px"}
          >
            <CloneButton />
          </Stack>
        </Stack>
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
