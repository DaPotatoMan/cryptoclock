import { createRouter, createWebHistory } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';
import inteceptRoutes from './interceptor';

const routes = setupLayouts(generatedRoutes as any);

const router = createRouter({
   routes,
   history: createWebHistory()
});

router.beforeEach(inteceptRoutes);

export default router;
