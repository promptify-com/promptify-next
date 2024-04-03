import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop";
import { Buffer } from "buffer";
import "react-image-crop/dist/ReactCrop.css";
import { useUpdateUserProfileMutation } from "@/core/api/user";
import { updateUser } from "@/core/store/userSlice";
import { useAppDispatch } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";

export const ProfileImageButton = () => {
  const token = useToken();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: 150,
    height: 150,
  });
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const onSave = async () => {
    const avatar = getCroppedImage();

    if (avatar && token) {
      const payload = await updateUserProfile({ token, data: { avatar } }).unwrap();
      dispatch(updateUser(payload));
      setShowCropModal(false);
    }
  };

  const imgRef = useRef<HTMLImageElement>(null);
  const aspect = 1;

  function getCroppedImage() {
    if (completedCrop) {
      // create a canvas element to draw the cropped image
      const canvas = document.createElement("canvas");

      // get the image element
      const image = imgRef.current;

      // draw the image on the canvas
      if (image) {
        const crop = completedCrop;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        if (ctx) {
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY,
          );
        }

        const base64Image = canvas.toDataURL("image/png"); // can be changed to jpeg/jpg etc

        if (base64Image) {
          const fileType = base64Image.split(";")[0].split(":")[1];

          const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");
          return new File([buffer], "fileName", { type: fileType });
        }
      }
    }
  }

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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedImage(event?.target?.files?.[0] || null);
            setShowCropModal(true);
          }}
        />
        Select Image
      </Button>
      <Modal
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        disableScrollLock
        sx={{
          display: "flex",
          position: "absolute",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Box
          display="flex"
          width="60vw"
          // maxHeight="60vh"
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
              aspect={aspect}
            >
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : "no-image"}
                ref={imgRef}
                alt={"profile image"}
                style={{ maxHeight: "70vh" }}
              />
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
                ":hover, :disabled": {
                  bgcolor: "transparent",
                  color: "#424242",
                },
              }}
              onClick={() => onSave()}
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
