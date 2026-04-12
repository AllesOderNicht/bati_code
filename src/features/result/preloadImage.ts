const preloadedSources = new Set<string>();

export function preloadImage(
  src: string | null | undefined,
  srcSet?: string | null,
  sizes?: string | null,
) {
  const cacheKey = srcSet ?? src;

  if (!src || !cacheKey || preloadedSources.has(cacheKey)) {
    return false;
  }

  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = "high";
  if (srcSet) {
    image.srcset = srcSet;
  }
  if (sizes) {
    image.sizes = sizes;
  }
  image.src = src;

  preloadedSources.add(cacheKey);
  return true;
}
