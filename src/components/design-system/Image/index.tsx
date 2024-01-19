import { StaticImport } from "next/dist/shared/lib/get-img-props";
import NextImage from "next/image";

interface NextImageProps {
  src: string | StaticImport;
  alt: string;
  priority?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  onClick?: () => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const Image: React.FC<NextImageProps> = ({
  src,
  alt,
  priority = false,
  style = {},
  width = 0,
  height = 0,
  loading,
  onClick,
  onError,
}) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="100vw" // This is helping us to tell Next.js Image component to resize the image to fit the width of its container.
      priority={priority}
      style={style}
      {...(loading && { loading })}
      onClick={onClick}
      onError={onError}
    />
  );
};

export default Image;
