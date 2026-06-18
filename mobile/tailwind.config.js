/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 7%)",
        foreground: "hsl(0 0% 100%)",

        primary: {
          DEFAULT: "hsl(167 77% 35%)",
          foreground: "hsl(0 0% 100%)",
        },

        secondary: {
          DEFAULT: "hsl(207 12% 17%)",
          foreground: "hsl(0 0% 100%)",
        },

        card: {
          DEFAULT: "hsl(204 12% 13%)",
          foreground: "hsl(0 0% 100%)",
        },

        popover: {
          DEFAULT: "hsl(204 12% 13%)",
          foreground: "hsl(0 0% 100%)",
        },

        destructive: {
          DEFAULT: "hsl(6 78% 57%)",
          foreground: "hsl(0 0% 100%)",
        },

        warning: {
          DEFAULT: "hsl(43 96% 56%)",
          foreground: "hsl(0 0% 100%)",
        },

        success: {
          DEFAULT: "hsl(167 77% 35%)",
          foreground: "hsl(0 0% 100%)",
        },

        border: "hsl(200 8% 20%)",
        input: "hsl(200 8% 20%)",

        muted: {
          DEFAULT: "hsl(220 5% 69%)",
          foreground: "hsl(210 6% 46%)",
        },

        accent: {
          DEFAULT: "hsl(210 6% 46%)",
          foreground: "hsl(0 0% 100%)",
        },

        ring: "hsl(167 77% 35%)",

        chart: {
          1: "hsl(167 77% 35%)",
          2: "hsl(24 95% 53%)",
          3: "hsl(6 78% 57%)",
          4: "hsl(200 8% 20%)",
          5: "hsl(220 5% 69%)",
        },
      },
      borderRadius: {
        md: '0.75rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}