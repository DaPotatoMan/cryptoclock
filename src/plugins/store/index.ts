import { useStorage } from '@vueuse/core';

const state = useStorage('cache-storage', {
   isAuthorized: false,
   darkTheme: false,
});

export default state;
