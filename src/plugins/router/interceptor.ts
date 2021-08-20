import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import store from '~/plugins/store';

function routeHandler(
   to: RouteLocationNormalized,
   from: RouteLocationNormalized,
   next: NavigationGuardNext
): void {
   const { requiresAuth } = to.meta;
   const loggedIn = store.value.isAuthorized;

   if (requiresAuth && !loggedIn) next('/login');
   else next();
}

export default routeHandler;
