export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 小红书风格配色
        'xiaohongshu': {
          pink: '#FF6B9D',
          yellow: '#FFD93D',
          green: '#6BCB77',
          light: '#FFF0F5',
        }
      }
    },
  },
  plugins: [],
}