import Image, { type ImageProps } from "next/image";

type WebpNextImageProps = ImageProps & {
  fallbackSrc?: string;
};

const isWebp = (src: string) => /\.webp(?:\?.*)?$/i.test(src);

const pngFallback = (src: string) =>
  src.replace(/\.webp(?=\?|$)/i, ".png");

export default function WebpNextImage({
  src,
  fallbackSrc,
  ...imageProps
}: WebpNextImageProps) {
  if (typeof src !== "string" || !isWebp(src)) {
    return <Image src={src} {...imageProps} />;
  }

  return (
    <picture className="contents">
      <source srcSet={src} type="image/webp" />
      <Image src={fallbackSrc ?? pngFallback(src)} {...imageProps} />
    </picture>
  );
}
