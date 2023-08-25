import NextImage from "next/image";

interface NextImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

const Image: React.FC<NextImageProps> = ({ src, alt, priority = false, style = {}, width = 0, height = 0 }) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="100vw" // This is helping us to tell Next.js Image component to resize the image to fit the width of its container.
      priority={priority}
      style={style}
    />
  );
};

export default Image;
