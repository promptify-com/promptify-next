import NextImage from "next/image";
import { useMediaQuery, useTheme } from "@mui/material";

interface NextImageProps {
  src: string;
  alt: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  borderRadius?: string | { [key: string]: string };
}

const Image: React.FC<NextImageProps> = ({
  src,
  alt,
  objectFit = "cover",
  borderRadius = "16px",
}) => {
  const theme = useTheme();
  const isMdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  const borderRadiusValue =
    typeof borderRadius === "string"
      ? borderRadius
      : isMdBreakpoint
      ? borderRadius.md
      : borderRadius.xs;

  return (
    <NextImage
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      style={{
        borderRadius: borderRadiusValue,
        objectFit,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default Image;
