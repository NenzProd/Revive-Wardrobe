export type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  quality?: string; // e.g. "auto" | "auto:eco"
  format?: string; // e.g. "auto"
  crop?: string; // e.g. "fill" | "fit"
};

const isCloudinaryUrl = (url: string) => /res\.cloudinary\.com\//i.test(url) && /\/upload\//i.test(url);

const buildTransform = (options: CloudinaryTransformOptions) => {
  const parts: string[] = [];
  const format = options.format ?? 'auto';
  const quality = options.quality ?? 'auto';
  const crop = options.crop ?? 'fill';

  parts.push(`f_${format}`);
  parts.push(`q_${quality}`);
  parts.push('dpr_auto');

  if (options.width) parts.push(`w_${options.width}`);
  if (options.height) parts.push(`h_${options.height}`);
  if (options.width || options.height) parts.push(`c_${crop}`);

  return parts.join(',');
};

/**
 * Inserts Cloudinary transformations right after `/upload/`.
 * Safe no-op for non-Cloudinary URLs.
 */
export const getOptimizedImageUrl = (url: string, options: CloudinaryTransformOptions = {}) => {
  if (!url || !isCloudinaryUrl(url)) return url;

  const [prefix, rest] = url.split('/upload/');
  if (!rest) return url;

  const [maybeTransformOrVersion, ...tail] = rest.split('/');

  // Cloudinary format:
  // - /upload/v123/... (no transforms)
  // - /upload/<transforms>/v123/... (with transforms)
  const hasExistingTransforms = !/^v\d+$/i.test(maybeTransformOrVersion);

  const desired = buildTransform(options);

  if (!hasExistingTransforms) {
    return `${prefix}/upload/${desired}/${[maybeTransformOrVersion, ...tail].join('/')}`;
  }

  // If transforms already exist, only append what isn't already present.
  const existing = maybeTransformOrVersion;
  const wantsWidth = options.width ? !/\bw_\d+\b/.test(existing) : true;
  const wantsHeight = options.height ? !/\bh_\d+\b/.test(existing) : true;
  const wantsQuality = !/\bq_[^,]+\b/.test(existing);
  const wantsFormat = !/\bf_[^,]+\b/.test(existing);
  const wantsDpr = !/\bdpr_[^,]+\b/.test(existing);

  const extraParts: string[] = [];
  if (wantsFormat) extraParts.push(`f_${options.format ?? 'auto'}`);
  if (wantsQuality) extraParts.push(`q_${options.quality ?? 'auto'}`);
  if (wantsDpr) extraParts.push('dpr_auto');
  if (options.width && wantsWidth) extraParts.push(`w_${options.width}`);
  if (options.height && wantsHeight) extraParts.push(`h_${options.height}`);
  if ((options.width && wantsWidth) || (options.height && wantsHeight)) extraParts.push(`c_${options.crop ?? 'fill'}`);

  const combined = extraParts.length ? `${existing},${extraParts.join(',')}` : existing;
  return `${prefix}/upload/${combined}/${tail.join('/')}`;
};

export const getOptimizedSrcSet = (url: string, widths: number[], options: Omit<CloudinaryTransformOptions, 'width'> = {}) => {
  if (!url || !isCloudinaryUrl(url)) return undefined;
  const unique = Array.from(new Set(widths)).sort((a, b) => a - b);
  return unique
    .map((w) => `${getOptimizedImageUrl(url, { ...options, width: w })} ${w}w`)
    .join(', ');
};
