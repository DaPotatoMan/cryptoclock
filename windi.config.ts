import { defineConfig } from 'windicss/helpers';
import defaultTheme from 'windicss/defaultTheme';
import scrollbar from '@windicss/plugin-scrollbar';
import plugin from 'windicss/plugin';
import colors from './windi.colors';

export default defineConfig({
   darkMode: false,

   theme: {
      fontFamily: {
         default: ['Inter', ...defaultTheme.fontFamily.sans]
      },

      extend: colors
   },

   plugins: [
      scrollbar,
      plugin(({ addUtilities }) => {
         addUtilities({
            '.theme-light': {
               '--color-text-default': '#000',
               '--color-bg-default': '#fff',
            }
         });
      })
   ]
});
