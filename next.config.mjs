/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to ./out.
  // Everything under public/ (logos, thumbs, token_list.json, llms.txt …)
  // is copied to ./out unchanged, so existing logo URLs keep working.
  output: 'export',
  // /ckb -> ckb.html (no trailing-slash redirects on existing links)
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
