import type { ImgHTMLAttributes } from "react";

type WebpImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string;
  fallbackSrc?: string;
};

const isWebp = (src: string) => /\.webp(?:\?.*)?$/i.test(src);

const pngFallback = (src: string) =>
  src.replace(/\.webp(?=\?|$)/i, ".png");

export default function WebpImage({
  src,
  fallbackSrc,
  ...imageProps
}: WebpImageProps) {
  if (!src || !isWebp(src)) {
    return <img src={src} {...imageProps} />;
  }

  return (
    <picture className="contents">
      <source srcSet={src} type="image/webp" />
      <img src={fallbackSrc ?? pngFallback(src)} {...imageProps} />
    </picture>
  );
}
