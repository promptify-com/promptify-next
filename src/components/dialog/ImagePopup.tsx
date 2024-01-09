import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ImagePopupProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ open, imageUrl, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderColor: "white",
          },
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <img
          src={imageUrl}
          alt="book cover"
          style={{ width: "100%" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePopup;
