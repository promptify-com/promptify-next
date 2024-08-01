import Stack from "@mui/material/Stack";
import type { Templates } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import TemplatePage from ".";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { initialState as initialTemplatesState, updatePopupTemplate } from "@/core/store/templatesSlice";
import Close from "@mui/icons-material/Close";
import DocumentPage from "@/components/Documents/DocumentPage";
import { setDocumentTitle } from "@/core/store/documentsSlice";

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

function TemplateDocumentModal() {
  const { data } = useAppSelector(
    state => state.templates?.popupTemplateDocument ?? initialTemplatesState.popupTemplateDocument,
  );
  const dispatch = useDispatch();

  const close = () => {
    dispatch(
      updatePopupTemplate({
        data: null,
      }),
    );
    dispatch(setDocumentTitle(""));
  };

  if (!data) return;

  const isTemplate = "example" in data;

  return (
    <Modal
      open={!!data.id}
      disableAutoFocus={true}
    >
      <Stack
        direction={"row"}
        bgcolor={"surfaceContainerLowest"}
        sx={{
          height: { xs: "calc(100svh - 12px)", md: "calc(100svh - 24px)" },
          m: { xs: "12px 12px 0", md: "24px 16px 0" },
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          overflow: "auto",
          overscrollBehavior: "contain",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <IconButton
          onClick={close}
          sx={{
            position: { xs: "fixed", md: "absolute" },
            top: { xs: "20px", md: "40px" },
            right: { xs: "20px", md: "24px" },
            zIndex: 9999,
            border: "none",
            bgcolor: { xs: "surfaceContainerLow", md: "transparent" },
            ":hover": { bgcolor: "surfaceContainerHigh" },
            "& svg": {
              width: { xs: "15px", md: "19px" },
              height: { xs: "15px", md: "19px" },
            },
          }}
        >
          <Close />
        </IconButton>
        {/* <NavigationBox
          template={template}
          type="previous"
        /> */}
        {isTemplate ? (
          <TemplatePage
            template={data}
            popup
          />
        ) : (
          <DocumentPage document={data} />
        )}
        {/* <NavigationBox
          template={template}
          type="next"
        /> */}
      </Stack>
    </Modal>
  );
}

export default TemplateDocumentModal;
