import { registerSW } from 'virtual:pwa-register';

registerSW({
   onOfflineReady() {
      console.debug('PWA is ready');
   }
});
