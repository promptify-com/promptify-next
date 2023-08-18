import NextImage from "next/image";

interface NextImageProps {
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}

const Image: React.FC<NextImageProps> = ({
  src,
  alt,
  loading="lazy",
  style = {},
}) => {
  
  return (
    <NextImage
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw" // This is helping us to tell Next.js Image component to resize the image to fit the width of its container.
      loading={loading}
      style={{...style}}
    />
  );
};

export default Image;
