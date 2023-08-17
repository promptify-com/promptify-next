import React from "react";
import Image from "next/image";
import { useMediaQuery, useTheme } from "@mui/material";

interface NextImageProps {
  src: string;
  alt: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  borderRadius?: string | { [key: string]: string };
}

const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  objectFit = "cover",
  borderRadius,
}) => {
  const theme = useTheme();
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  let borderRadiusValue: string | undefined;

  if (typeof borderRadius === "string") {
    borderRadiusValue = borderRadius;
  } else if (typeof borderRadius === "object") {
    const breakpoint = isMdBreakpoint ? "md" : "xs";
    borderRadiusValue = borderRadius[breakpoint] || "16px";
  } else {
    borderRadiusValue = "16px";
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: borderRadiusValue,
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          borderRadius: borderRadiusValue,
          objectFit,
        }}
      />
    </div>
  );
};

export default NextImage;
