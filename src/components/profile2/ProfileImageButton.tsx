import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { useImageCrop } from "@/hooks/useImageCrop";
import useToken from "@/hooks/useToken";

export const ProfileImageButton = () => {
  const token = useToken();
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

  return (
    <>
      <Button
        component="label"
        sx={{
          border: "1px solid",
          borderColor: "surfaceContainerHigh",
          p: "8px 24px",
          fontSize: 14,
          fontWeight: 500,
          color: "onSurface",
        }}
      >
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={onSelectFile}
        />
        Select Image
      </Button>
      <Modal
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        disableScrollLock
        sx={{
          display: "flex",
          position: "fixed",
          justifyContent: "center",
          alignSelf: "center",
          overflow: "hidden",
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
            justifyContent={{ xs: "center", sm: "flex-end" }}
            width={{ xs: "100%", sm: "auto" }}
            mb="2rem"
            mr="2rem"
          >
            <Button
              sx={{
                color: "#424242",
                width: { xs: "100px", sm: "160px" },
                height: { xs: "40px", sm: "50px" },
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
                width: { xs: "100px", sm: "160px" },
                height: { xs: "40px", sm: "50px" },
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ariaLabel: "upload picture",
                border: "1px solid",
                bgcolor: "#424242",
                color: "#FFF",
                fontSize: { xs: "0.6rem", sm: "0.8rem" },
                ":hover, :disabled": {
                  bgcolor: "transparent",
                  color: "#424242",
                },
              }}
              onClick={onSave}
            >
              {isLoading ? (
                <CircularProgress
                  size={20}
                  color="secondary"
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
