import Image from "next/image";

import { urlFor } from "@/sanity/image";

export type SanityImageSource =
  { asset?: { _ref?: string } } | null | undefined;

type SanityImageProps = {
  image: SanityImageSource;
  alt: string;
  /** Passed to next/image so it picks a sensible width per breakpoint. */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** A Sanity image that fills its (positioned, sized) parent. Renders nothing without an asset. */
export function SanityImage({
  image,
  alt,
  sizes,
  className,
  priority,
}: SanityImageProps) {
  if (!image?.asset?._ref) return null;
  return (
    <Image
      src={urlFor(image).url()}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
