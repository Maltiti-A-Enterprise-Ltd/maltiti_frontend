/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  transpilePackages: ["styled-components"],
  webpack: (config) => {
    // Handle SVG imports as React components
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            exportType: "named",
            namedExport: "ReactComponent",
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
        "url-loader",
      ],
    });

    // Handle image files
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|jfif)$/i,
      type: "asset/resource",
    });

    return config;
  },
};

module.exports = nextConfig;
