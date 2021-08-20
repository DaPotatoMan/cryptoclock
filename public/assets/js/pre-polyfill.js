Object.assign(window, {
   get global() {
      return window.global || window;
   },

   require: () => {}
});
