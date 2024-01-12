import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Image from "@/components/design-system/Image";

interface ImagePopupProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}

function ImagePopup({ open, imageUrl, onClose }: ImagePopupProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        p: "4px",
        "& .MuiDialog-container .MuiPaper-root": {
          overflowY: "unset",
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: "-10px",
          top: "-12px",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          p: "2px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderColor: "white",
          },
          boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          "& svg": {
            width: "15px",
            height: "15px",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Image
          src={imageUrl}
          alt="Promptify"
          style={{ width: "100%", height: "auto" }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ImagePopup;
