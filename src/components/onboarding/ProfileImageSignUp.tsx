import { useRef } from "react";
import FinishCard from "./FinishCard";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";

import type { User } from "@/core/api/dto/user";
import { useImageCrop } from "@/hooks/useImageCrop";

interface Props {
  user: User | null;
  token: string | null;
}

const ProfileImageSignUp = ({ user, token }: Props) => {
  const {
    imgSrc,
    setCompletedCrop,
    showCropModal,
    setShowCropModal,
    crop,
    setCrop,
    imgRef,
    onSave,
    onSelectFile,
    onImageLoad,
    isLoading,
  } = useImageCrop(token);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <FinishCard title="Profile image:">
        <Box
          sx={{
            width: { xs: "85%", sm: "100%" },
            height: { xs: "200px", sm: "124px" },
            display: "flex",
            padding: "var(--1, 8px) var(--3, 24px)",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "24px",
            border: "1px solid var(--surfaceContainerHigh, #E9E7EC)",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Avatar
            src={user?.avatar ?? defaultAvatar.src}
            alt={user?.first_name ?? "Promptify"}
            sx={{
              border: "2px solid var(--surfaceContainerLowest, #FFF)",
              borderRadius: "999px",
              width: "76px",
              height: "76px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", sm: "flex-end" },
              gap: "var(--1, 8px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                padding: "8px 24px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "99px",
                border: "1px solid var(--surfaceContainerHigh, #E9E7EC)",
                cursor: "pointer",
                transition: "bgcolor 0.3s ease",
                ":hover": {
                  bgcolor: "surfaceContainerHigh",
                  transition: "bgcolor 0.3s ease",
                },
              }}
              aria-label="upload picture"
              onClick={handleSelectImageClick}
            >
              <Typography
                sx={{
                  color: "var(--onSurface, var(--onSurface, #1B1B1F))",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "170%",
                }}
              >
                Select image
              </Typography>

              <input
                hidden
                ref={fileInputRef}
                accept="image/*"
                type="file"
                onChange={onSelectFile}
              />
            </Box>
            <Typography
              sx={{
                color: "var(--secondary, var(--secondary, #575E71))",
                textAlign: "right",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "140%",
                letterSpacing: "0.17px",
              }}
            >
              At least 240x240 px, jpg or png
            </Typography>
          </Box>
        </Box>
      </FinishCard>
      <Modal
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        disableScrollLock
        sx={{
          display: "flex",
          position: "fixed",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Box
          display="flex"
          width="60vw"
          maxHeight="95vh"
          bgcolor="#FFF"
          justifyContent="center"
          alignSelf="center"
          flexDirection="column"
          borderRadius="15px"
          overflow="scroll"
        >
          <Typography
            fontWeight={500}
            fontSize={{ xs: "1rem", sm: "1.5rem" }}
            mt="2rem"
            width="90%"
            alignSelf="center"
          >
            Edit profile image
          </Typography>

          <Box
            display="flex"
            alignContent="center"
            justifyContent="center"
            alignSelf="center"
            width="90%"
            maxHeight="70vh"
            mt="1.5rem"
            mb="1.5rem"
            overflow="scroll"
          >
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={1}
            >
              {imgSrc && (
                <img
                  src={imgSrc}
                  ref={imgRef}
                  alt="profile image"
                  style={{ maxHeight: "70vh" }}
                  onLoad={onImageLoad}
                />
              )}
            </ReactCrop>
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            mb="2rem"
            mr="2rem"
          >
            <Button
              sx={{
                color: "#424242",
                width: "160px",
                height: "50px",
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ariaLabel: "upload picture",
                border: "1px solid #424242",
                mr: "1rem",
              }}
              onClick={() => setShowCropModal(false)}
            >
              <Typography
                fontWeight={500}
                fontSize={{ xs: "0.6rem", sm: "0.8rem" }}
              >
                Cancel
              </Typography>
            </Button>
            <Button
              disabled={isLoading}
              sx={{
                width: "160px",
                height: "50px",
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ariaLabel: "upload picture",
                border: "1px solid",
                bgcolor: "#424242",
                color: "#FFF",
                ":hover": {
                  bgcolor: "transparent",
                  color: "#424242",
                },
              }}
              onClick={onSave}
            >
              {isLoading ? (
                <CircularProgress
                  size={20}
                  sx={{ color: "onPrimary" }}
                />
              ) : (
                <>Crop & Save</>
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileImageSignUp;
