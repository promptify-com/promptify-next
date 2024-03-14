import { StaticImport } from "next/dist/shared/lib/get-img-props";
import NextImage from "next/image";

interface NextImageProps {
  src: string | StaticImport;
  alt: string;
  priority?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  sizes?: string;
  fill?: boolean;
  loading?: "eager" | "lazy";
  onClick?: () => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: () => void;
}

const Image: React.FC<NextImageProps> = ({
  src,
  alt,
  priority = false,
  style = {},
  width = 0,
  height = 0,
  sizes,
  fill,
  loading,
  onClick,
  onError,
  onLoad,
}) => {
  return (
    <NextImage
      src={src ?? require("@/assets/images/default-thumbnail.jpg")}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes ?? "100vw"}
      priority={priority}
      fill={fill}
      style={style}
      {...(loading && { loading })}
      onClick={onClick}
      onError={onError}
      onLoad={onLoad}
    />
  );
};

export default Image;
