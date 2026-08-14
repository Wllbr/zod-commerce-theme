module.exports = {
  important: false,
  content: ['src/views/**/*.twig','src/assets/js/**/*.js'],
  theme: {
    container: { center: true, padding: {DEFAULT:'16px',lg:'24px'}, screens: {'2xl':'1320px'} },
    fontFamily: { sans: ['var(--font-main)','-apple-system','BlinkMacSystemFont','Segoe UI','sans-serif'], primary:'var(--font-main)' },
    extend: {
      colors: {
        primary:'var(--color-primary)', 'primary-d':'var(--color-primary-dark)', 'primary-l':'var(--color-primary-light)', 'primary-reverse':'var(--color-primary-reverse)',
        ink:'#17191C', muted:'#667085', canvas:'#F6F7F8', line:'#E7E9EC', success:'#147A4B', warning:'#B76A12', danger:'#B4232A'
      },
      borderRadius: { DEFAULT:'12px', xl:'16px', '2xl':'20px' },
      boxShadow: { card:'0 8px 28px rgba(16,24,40,.06)', lift:'0 14px 40px rgba(16,24,40,.10)', header:'0 1px 0 rgba(16,24,40,.08)' },
      screens: { xxs:'380px', xs:'480px' }
    }
  },
  corePlugins: { outline:false },
  plugins: [require('@tailwindcss/forms')]
};
