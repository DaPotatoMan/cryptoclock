import mitt from 'mitt';

// Assign instance
const events = mitt<Events>();

Object.assign(window, {
   get events() {
      return events;
   }
});
