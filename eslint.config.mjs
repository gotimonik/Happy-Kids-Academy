import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/sw.js",
      "public/workbox-*.js",
      // Native Capacitor project + its bundled copy of the static export —
      // generated/vendored output, not source to lint.
      "android/**",
      "out/**",
    ],
  },
];

export default eslintConfig;
