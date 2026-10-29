import type { NextConfig } from "next";

/*
 * Static export: `npm run build` writes plain HTML/CSS/JS to ./out, then
 * scripts/optimize-images.mjs adds the two WebP sizes for every image.
 * Each page is a folder with an index.html (/es/ is es/index.html), so any
 * host serves it as is; with one .html per page, Hostinger's server mixed up
 * the file es.html and the folder es/. Redirects and security headers live in
 * public/.htaccess (Hostinger) and firebase.json (Firebase), not here.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
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
