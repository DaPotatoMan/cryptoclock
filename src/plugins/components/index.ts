import { App } from 'vue';
import './events';

// Import Global APIs
import 'vue-global-api/ref';
import 'vue-global-api/watch';
import 'vue-global-api/computed';
import 'vue-global-api/reactive';
import 'vue-global-api/provide';
import 'vue-global-api/inject';

import 'vue-global-api/nextTick';
import 'vue-global-api/onMounted';
import 'vue-global-api/onUnmounted';

// Import Components
import { DatePicker } from 'v-calendar';

export default {
   install(app: App) {
      app.component('DatePicker', DatePicker);
   }
};
