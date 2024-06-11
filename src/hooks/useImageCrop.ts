import { useState, useRef } from "react";
import { PixelCrop, Crop } from "react-image-crop";
import { useUpdateUserProfileMutation } from "@/core/api/user";
import { updateUser } from "@/core/store/userSlice";
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { canvasPreview } from "@/common/helpers/canvasPreview";

export function useImageCrop(token: string | null) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: 150,
    height: 150,
  });
  const imgRef = useRef<HTMLImageElement>(null);
  const dispatch = useAppDispatch();
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const getCroppedImage = async () => {
    if (completedCrop && imgRef.current && selectedImage) {
      const canvas = document.createElement("canvas");
      await canvasPreview(imgRef.current, canvas, completedCrop);

      const originalName = selectedImage.name;
      const timestamp = Date.now();
      const uniqueName = `${timestamp}-${originalName}`;

      return new Promise<File | null>(resolve => {
        canvas.toBlob(blob => {
          if (blob) {
            resolve(new File([blob], uniqueName, { type: blob.type }));
          } else {
            resolve(null);
          }
        });
      });
    }
    return null;
  };

  const onSave = async () => {
    const avatar = await getCroppedImage();
    if (avatar && token) {
      const payload = await updateUserProfile({ token, data: { avatar } }).unwrap();
      dispatch(updateUser(payload));
      setShowCropModal(false);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      e.target.value = "";

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
          const reader = new FileReader();
          reader.onload = () => {
            setImgSrc(reader.result as string);
            setShowCropModal(true);
          };
          reader.readAsDataURL(file);
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
      reader.onload = e => {
        if (e.target?.result) {
          image.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: "px",
      x: 0,
      y: 0,
      width: width / 2,
      height: height / 2,
    });
  };

  return {
    selectedImage,
    imgSrc,
    setSelectedImage,
    completedCrop,
    setCompletedCrop,
    showCropModal,
    setShowCropModal,
    crop,
    setCrop,
    imgRef,
    getCroppedImage,
    onSave,
    onSelectFile,
    onImageLoad,
    isLoading,
  };
}
