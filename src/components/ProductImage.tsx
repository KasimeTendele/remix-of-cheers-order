export function ProductImage({
  image,
  alt,
  className = "",
  fallbackSize = "text-4xl",
}: {
  image?: string;
  alt: string;
  className?: string;
  fallbackSize?: string;
}) {
  const isUrl = !!image && (image.startsWith("/") || image.startsWith("http"));
  if (isUrl) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }
  return <span className={fallbackSize}>{image ?? "🍸"}</span>;
}
