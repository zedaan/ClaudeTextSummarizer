/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'app-text': '#0F0000',
        'app-bg': '#83B0BD',
        'app-input': '#FCD9D3',
        'app-button': '#F9B759',
        'app-copied': '#83f5bc',
        'app-failed': '#ffa3a3',
        'app-hover': '#fba122',
        'app-focus': '#9F570A',
        'app-disabled': '#B38443'
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}
