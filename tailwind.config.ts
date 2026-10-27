import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FAF9F6",
        },
        sage: {
          DEFAULT: "#BDD2BF",
          hover: "#A9C3AE",
          light: "#EBF2EC",
          dark: "#37533E",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
