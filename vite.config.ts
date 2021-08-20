import { resolve } from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons';
import ViteComponents from 'vite-plugin-components';
import WindiCSS from 'vite-plugin-windicss';

// PostCSS Plugins
import pcssNested from 'postcss-nested';

export default defineConfig({
   resolve: {
      alias: {
         '~': resolve(__dirname, 'src'),
         '@assets': resolve(__dirname, 'src/assets'),
         '@styles': resolve(__dirname, 'src/assets/styles')
      }
   },

   plugins: [
      Vue(),
      Pages({
         routeBlockLang: 'yaml'
      }),
      Layouts({
         layoutsDir: 'src/components/layouts'
      }),
      ViteComponents({
         globalComponentsDeclaration: 'types/components.d.ts',
         customComponentResolvers: [
            ViteIconsResolver({
               componentPrefix: 'icon'
               // enabledCollections: ['carbon']
            })
         ]
      }),
      ViteIcons(),
      WindiCSS()
   ],

   css: {
      postcss: {
         plugins: [pcssNested()] as any
      }
   },

   optimizeDeps: {
      exclude: ['v-calendar', 'vue-demi']
   }
});
