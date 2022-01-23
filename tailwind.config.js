module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              marginLeft: theme("spacing.1"),
              marginRight: theme("spacing.1"),
              padding: theme("spacing")['0.5'],
              borderRadius: theme("spacing.1"),
              border: `1px solid ${theme("colors.gray.300")}`,
              fontWeight: "normal",
              fontFamily: '"SF Mono", "Roboto Mono", Menlo, monospace',
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            pre: {
              code: {
                marginLeft: 0,
                marginRight: 0,
                border: 0,
                borderRadius: 0,
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
