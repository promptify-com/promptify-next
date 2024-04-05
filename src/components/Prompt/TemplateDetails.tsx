import { stripTags } from "@/common/helpers";
import { formatDate } from "@/common/helpers/timeManipulation";
import { Templates } from "@/core/api/dto/templates";
import { setSelectedTag } from "@/core/store/filtersSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Collapse, alpha } from "@mui/material";
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
import useBrowser from "@/hooks/useBrowser";
import Link from "next/link";
import { useState } from "react";
import Header from "./Common/Header";

interface TemplateDetailsProps {
  template: Templates;
  close?(): void;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template, close }) => {
  const router = useRouter();
  const { isMobile } = useBrowser();
  const dispatch = useDispatch();
  const { cloneTemplate } = useCloneTemplate({ template });
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isOwner = currentUser?.is_admin || currentUser?.id === template.created_by.id;

  const [showMore, setShowMore] = useState(false);

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
        ml: "-17px",
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
    router.push("/chat");
    dispatch(
      updatePopupTemplate({
        template: null,
      }),
    );
  };

  return (
    <Stack
      minHeight={{ xs: "calc(100svh - 60px)", md: "100%" }}
      overflow={"auto"}
      bgcolor={{ xs: "surfaceContainerHigh", md: "transparent" }}
      sx={{
        "&::-webkit-scrollbar": {
          width: 0,
        },
      }}
    >
      <Stack
        gap={6}
        p={{ xs: "24px 0px", md: "48px 40px 24px" }}
      >
        <Stack gap={3}>
          <Stack
            gap={2}
            px={{ xs: "16px", md: 0 }}
          >
            {isMobile && <Header template={template} />}
            <Typography
              fontSize={24}
              fontWeight={500}
              color={"onSurface"}
            >
              {template.title}
            </Typography>
            {isMobile && (
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
              >
                <Image
                  src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                  alt={template.created_by?.first_name?.slice(0, 1) ?? "P"}
                  width={32}
                  height={32}
                  style={{
                    backgroundColor: theme.palette.surface[5],
                    borderRadius: "50%",
                  }}
                />

                <Link
                  href={`/users/${template.created_by?.username}`}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    fontSize={13}
                    fontWeight={400}
                    color={"onSurface"}
                  >
                    by {template.created_by?.first_name || template.created_by?.username}
                  </Typography>
                </Link>
              </Stack>
            )}
          </Stack>
          {isMobile && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "30svh",
                borderRadius: { md: "24px" },
                overflow: "hidden",
              }}
            >
              <Image
                src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
                alt={template.title?.slice(0, 1) ?? "P"}
                priority={true}
                fill
                sizes="(max-width: 900px) 253px, 446px"
                style={{
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {!isMobile && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
            >
              <Image
                src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={template.created_by?.first_name?.slice(0, 1) ?? "P"}
                width={32}
                height={32}
                style={{
                  backgroundColor: theme.palette.surface[5],
                  borderRadius: "50%",
                }}
              />

              <Link
                href={`/users/${template.created_by?.username}`}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  fontSize={13}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  by {template.created_by?.first_name || template.created_by?.username}
                </Typography>
              </Link>
            </Stack>
          )}

          <Stack
            direction={"row"}
            gap={1}
            px={{ xs: "16px", md: 0 }}
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
            px={{ xs: "16px", md: 0 }}
            fontSize={{ xs: 14, md: 16 }}
            fontWeight={400}
            color={alpha(theme.palette.onSurface, 0.75)}
          >
            {stripTags(template.description)}
          </Typography>

          <Stack
            px={{ xs: "16px", md: 0 }}
            gap={2}
          >
            <RunButton
              title="Run prompt"
              onClick={handleRun}
              sx={{
                maxWidth: "none",
                height: "auto",
                p: "12px 16px",
              }}
            />

            {!showMore && isMobile && (
              <Button
                onClick={() => setShowMore(!showMore)}
                variant="outlined"
                sx={{
                  width: "197px",
                  mx: "auto",
                  fontSize: 14,
                  p: "8px 16px",
                  color: "onSurface",
                }}
              >
                More about this prompt
              </Button>
            )}
          </Stack>
        </Stack>

        <Collapse
          in={showMore || !isMobile}
          timeout="auto"
          unmountOnExit
        >
          <Stack
            alignItems={"flex-start"}
            px={{ xs: "16px", md: 0 }}
          >
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
                        close?.();
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
                Views: <span>{template.views ?? 0}</span>
              </Typography>
              <Typography sx={detailsStyle}>
                Runs: <span>{template.executions_count ?? 0}</span>
              </Typography>
            </Stack>
            <Stack
              gap={2}
              py={"16px"}
            >
              <CloneButton />
            </Stack>
          </Stack>
        </Collapse>
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
