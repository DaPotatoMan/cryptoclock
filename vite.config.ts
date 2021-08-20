import { resolve } from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons';
import ViteComponents from 'vite-plugin-components';
import WindiCSS from 'vite-plugin-windicss';
import { VitePWA } from 'vite-plugin-pwa';

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
      WindiCSS(),
      VitePWA({
         srcDir: 'src',
         strategies: 'generateSW',
         registerType: 'autoUpdate',
         includeAssets: ['/favicon.ico'],
         manifest: {
            name: 'CryptoClock',
            short_name: 'CryptoClock',
            theme_color: '#ffffff',
            icons: [
               {
                  src: '/assets/icons/android-chrome-192x192.png',
                  sizes: '192x192',
                  type: 'image/png'
               },
               {
                  src: '/assets/icons/logo.png',
                  sizes: '192x192',
                  type: 'image/png'
               },
               {
                  src: '/assets/icons/logo-512x512.png',
                  sizes: '512x512',
                  type: 'image/png'
               },
               {
                  src: '/assets/icons/logo-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any maskable'
               }
            ]
         }
      })
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
