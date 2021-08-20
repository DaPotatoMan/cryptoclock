import 'virtual:windi.css';
import '@styles/index.pcss';
import '~/plugins/components/pwa';

import { createApp } from 'vue';
import App from '~/App.vue';
import router from '~/plugins/router';
import components from '~/plugins/components';

createApp(App)
   .use(router)
   .use(components)
   .mount('#app');
