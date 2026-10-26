/*
 * next/image loader for the static export. After `next build`,
 * scripts/optimize-images.mjs writes two WebP sizes next to every image in
 * out/_next/static/media (`name.w640.webp`, `name.w1280.webp`); this loader
 * points the srcset at them. In development the original file is served.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (process.env.NODE_ENV !== "production" || !/^\/_next\/static\/media\/.+\.(png|jpe?g)$/i.test(src)) return src;
  const size = width <= 640 ? 640 : 1280;
  return src.replace(/\.(png|jpe?g)$/i, `.w${size}.webp`);
}
