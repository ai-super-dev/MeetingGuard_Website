import type { NextConfig } from "next";

/*
 * Static export for Firebase Hosting: `npm run build` writes plain HTML/CSS/JS
 * to ./out (one .html file per page, both languages), then
 * scripts/optimize-images.mjs adds the two WebP sizes for every image.
 * Redirects and security headers live in firebase.json, not here.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // two image sizes, as the brief asks; the loader maps every width onto one of them
    deviceSizes: [640, 1280],
    imageSizes: [320],
    qualities: [75, 90],
  },
  experimental: {
    // one bilingual 404 for every unmatched URL (the site has an English and a Spanish root layout)
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
