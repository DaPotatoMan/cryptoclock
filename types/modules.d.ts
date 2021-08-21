declare module '@windicss/plugin-scrollbar';

declare const events: import('mitt').Emitter<Events>;

interface Window {
   beacon: typeof import('@airgap/beacon-sdk');
   events: typeof events;
}
