declare module '@windicss/plugin-scrollbar';

declare const events: import('mitt').Emitter<Events>;

interface Window {
   events: typeof events;
}
