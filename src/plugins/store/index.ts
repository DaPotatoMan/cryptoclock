import { useStorage } from '@vueuse/core';

const state = useStorage('cache-storage', {
   isAuthorized: false
});

export default state;
