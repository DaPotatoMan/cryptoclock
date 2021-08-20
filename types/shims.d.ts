type PropType<T> = import('vue').PropType<T>;

declare const inject: (key: string | InjectionKey<any>) => any;

declare module '*.vue' {
   import type { DefineComponent } from 'vue';

   const component: DefineComponent<{}, {}, any>;
   export default component;
}
