import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop";
import { Buffer } from "buffer";
import "react-image-crop/dist/ReactCrop.css";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";
import { useUpdateUser } from "@/hooks/api/user";
import useUser from "@/hooks/useUser";

interface IProps {
  formik?: FormikProps<IEditProfile>;
}

export const ProfileImage: React.FC<IProps> = ({}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const user = useUser();

  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: 150,
    height: 150,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateUser, _, isLoading] = useUpdateUser();

  const onSave = async () => {
    const avatar = getCroppedImage();

    if (avatar) {
      setCroppedImage(avatar);
      await updateUser({
        avatar,
      }).then(() => setShowCropModal(false));
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
            crop.height * scaleY
          );
        }

        const base64Image = canvas.toDataURL("image/png"); // can be changed to jpeg/jpg etc

        if (base64Image) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          const fileType = base64Image.split(";")[0].split(":")[1];

          const buffer = Buffer.from(
            base64Image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          return new File([buffer], "fileName", { type: fileType });
        }
      }
    }
  }

  return (
    <Box mt="70px">
      <Typography
        fontWeight={500}
        fontSize="1rem"
        textAlign={{ xs: "center", sm: "start" }}
      >
        Profile Image
      </Typography>
      <Box
        display="flex"
        mt="2rem"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={{ xs: "center", sm: "flex-start" }}
        alignItems={{ xs: "center", sm: "flex-start" }}
      >
        <Box>
          <Avatar
            src={
              croppedImage
                ? URL.createObjectURL(croppedImage)
                : user?.avatar || "no-image"
            }
            sx={{ width: "150px", height: "150px" }}
          />
        </Box>
        <Box
          component="label"
          ml={{ xs: "0rem", sm: "2rem" }}
          mt={{ xs: "1rem", sm: "0rem" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignSelf="center"
          alignItems={{ xs: "center", sm: "flex-start" }}
        >
          <Box
            bgcolor="#424242"
            width="160px"
            height="50px"
            borderRadius="25px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            aria-label="upload picture"
            sx={{ cursor: "pointer" }}
          >
            <Typography
              fontWeight={400}
              fontSize={{ xs: "0.8rem", sm: "1rem" }}
              color="#FFF"
            >
              Select Image
            </Typography>

            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedImage(event?.target?.files?.[0] || null);
                setShowCropModal(true);
              }}
            />
          </Box>
          <Typography
            fontWeight={400}
            fontSize={{ xs: "0.6rem", sm: "0.8rem" }}
            mt="1rem"
          >
            Please choose an image that is at least fit to requirements
          </Typography>
        </Box>
      </Box>
      <Modal
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
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
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : "no-image"
                }
                ref={imgRef}
                alt={"profile image"}
                style={{ maxHeight: "70vh" }}
              />
            </ReactCrop>
          </Box>

          <Box display="flex" justifyContent="flex-end" mb="2rem" mr="2rem">
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
              sx={{
                bgcolor: "#424242",
                width: "160px",
                height: "50px",
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ariaLabel: "upload picture",
                color: "#FFF",
              }}
              onClick={() => onSave()}
            >
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Typography
                  fontWeight={500}
                  fontSize={{ xs: "0.6rem", sm: "0.8rem" }}
                >
                  Crop & Save
                </Typography>
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
