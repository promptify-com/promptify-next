import FinishCard from "./FinishCard";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop";

import type { User } from "@/core/api/dto/user";
import { useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/useStore";
import { useUpdateUserProfileMutation } from "@/core/api/user";
import { updateUser } from "@/core/store/userSlice";
import { setToast } from "@/core/store/toastSlice";

interface Props {
  user: User | null;
  token: string | null;
}
const ProfileImageSignUp = ({ user, token }: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const dispatch = useAppDispatch();
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
      setCroppedImage(avatar);

      const payload = await updateUserProfile({ token, data: { avatar } }).unwrap();
      dispatch(updateUser(payload));
      setShowCropModal(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          const fileType = base64Image.split(";")[0].split(":")[1];

          const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");
          return new File([buffer], "fileName", { type: fileType });
        }
      }
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const image = new Image();
      image.onload = () => {
        if (image.width < 240 || image.height < 240) {
          dispatch(
            setToast({
              message: "Image dimensions should be at least 240x240 pixels.",
              severity: "error",
              position: { vertical: "bottom", horizontal: "left" },
            }),
          );
        } else {
          setSelectedImage(file);
          setShowCropModal(true);
        }
      };
      image.onerror = () => {
        dispatch(
          setToast({
            message: "Please select a valid image file.",
            severity: "error",
            position: { vertical: "bottom", horizontal: "left" },
          }),
        );
      };

      const reader = new FileReader();
      reader.onload = e => (image.src = e.target?.result as string);
      reader.readAsDataURL(file);
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
                onChange={handleImageChange}
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

export default ProfileImageSignUp;
