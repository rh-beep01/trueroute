/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:      { DEFAULT: '#0F172A', dark: '#1E293B', tint: '#F1F5F9' },
        terra:     { DEFAULT: '#E05A47', dark: '#C84B39', tint: '#FDF2F0' },
        sage:      { DEFAULT: '#2E6F40', tint: '#E8F2EC' },
        sand:      { DEFAULT: '#DFB15B', tint: '#FDF8ED' },
        canvas:    { DEFAULT: '#FAFAF7', border: '#F1EFE7' },
      },
      fontFamily: {
        display: ['var(--font-plus-jakarta)', 'sans-serif'],
        body:    ['var(--font-plus-jakarta)', 'sans-serif'],
        hand:    ['var(--font-kalam)', 'cursive'],
      },
      boxShadow: {
        sm:   '0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
        md:   '0 4px 16px rgba(15,23,42,0.10), 0 2px 4px rgba(15,23,42,0.06)',
        lg:   '0 10px 32px rgba(15,23,42,0.12)',
        glow: '0 0 0 3px rgba(224,90,71,0.25)',
      },
    },
  },
  plugins: [],
}
