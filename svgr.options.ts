/** Turbopack과 webpack 빌드에서 공유하는 SVG 컴포넌트 옵션입니다. */
export const svgrOptions = {
  runtimeConfig: false,
  icon: true,
  svgProps: {
    focusable: "false",
    "aria-hidden": "true",
  },
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            convertColors: { currentColor: false },
          },
        },
      },
    ],
  },
} satisfies Record<string, unknown>;
