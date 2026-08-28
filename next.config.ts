import type { NextConfig } from "next";
import { svgrOptions } from "./svgr.options";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [{ loader: "@svgr/webpack", options: svgrOptions }],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: RegExp }) =>
        rule.test instanceof RegExp && rule.test.test(".svg"),
    ) as { exclude?: RegExp | RegExp[] } | undefined;

    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i;

    config.module.rules.push({
      test: /\.svg$/i,
      use: [{ loader: "@svgr/webpack", options: svgrOptions }],
    });

    return config;
  },
};

export default nextConfig;
