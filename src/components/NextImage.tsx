import React from "react";
import Image from "next/image";

interface NextImageProps {
  src: string;
  alt: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  borderRadius?: string;
}

const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  objectFit = "cover",
  borderRadius = "16px",
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          borderRadius,
          objectFit,
        }}
      />
    </div>
  );
};

export default NextImage;
