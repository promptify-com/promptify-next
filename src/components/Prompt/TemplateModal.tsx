import Stack from "@mui/material/Stack";
import { Templates } from "@/core/api/dto/templates";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import Image from "@/components/design-system/Image";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import TemplatePage from ".";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { updatePopupTemplate } from "@/core/store/templatesSlice";
import Close from "@mui/icons-material/Close";
import { useEffect } from "react";

interface NavigationBoxProps {
  template: Templates | null;
  type: "previous" | "next";
}

const NavigationBox = ({ template, type }: NavigationBoxProps) => {
  const isNext = type === "next";

  return (
    <Stack
      direction={"row"}
      alignItems={"flex-end"}
      p={"24px 16px"}
    >
      <Box
        sx={{
          p: "8px",
          borderRadius: "16px",
          cursor: "pointer",
          img: {
            borderRadius: "50%",
            transition: "all .6s ease-in-out .1s",
          },
          ":hover": {
            bgcolor: "surfaceContainerHigh",
            img: {
              borderRadius: "16px",
            },
          },
        }}
      >
        <Image
          src={template?.thumbnail ?? require("@/assets/images/default-avatar.jpg")}
          alt={template?.title?.slice(0, 1) ?? "P"}
          width={56}
          height={56}
        />
        <Stack
          alignItems={"center"}
          gap={1}
          py={"16px"}
        >
          {isNext ? <ArrowForward fontSize="medium" /> : <ArrowBack fontSize="medium" />}
          <Typography
            fontSize={13}
            fontWeight={300}
          >
            {isNext ? "Next" : "Previous"}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

function TemplateModal() {
  const { template, previous, next } = useAppSelector(state => state.template.popupTemplate);
  const dispatch = useDispatch();

  const close = () => {
    dispatch(
      updatePopupTemplate({
        template: null,
      }),
    );
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  if (!template) return;

  return (
    <Modal
      open={!!template.id}
      disableAutoFocus={true}
    >
      <Stack
        direction={"row"}
        bgcolor={"surfaceContainerLowest"}
        sx={{
          height: "calc(100svh - 24px)",
          m: "24px 16px 0",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          overflow: "auto",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: { xs: "4px", md: "6px" },
            p: 1,
          },
          ":hover&::-webkit-scrollbar-thumb": {
            backgroundColor: "surface.5",
            outline: "1px solid surface.1",
            borderRadius: "10px",
          },
        }}
      >
        <IconButton
          onClick={close}
          sx={{
            position: "absolute",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            border: "none",
            ":hover": { bgcolor: "surfaceContainerHigh" },
          }}
        >
          <Close />
        </IconButton>
        {/* <NavigationBox
          template={template}
          type="previous"
        /> */}
        <TemplatePage
          template={template}
          popup
        />
        {/* <NavigationBox
          template={template}
          type="next"
        /> */}
      </Stack>
    </Modal>
  );
}

export default TemplateModal;
