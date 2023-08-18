import NextImage from "next/image";

interface NextImageProps {
  src: string;
  alt: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  borderRadius?: string;
}

const Image: React.FC<NextImageProps> = ({
  src,
  alt,
  objectFit = "cover",
  borderRadius = "16px",
}) => {
  
  return (
    <NextImage
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      priority
      style={{
        borderRadius,
        objectFit,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default Image;
