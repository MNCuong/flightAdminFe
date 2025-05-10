import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { isAuthenticated } from '@/utils/auth';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/authentication/Error.vue'),
      meta: { title: '404 - Không tìm thấy trang' }
    },
    MainRoutes,
    AuthRoutes
  ]
});

router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    if ((to.name === 'Login' || to.name === 'Register') && loggedIn) {
      next({ path: '/' });
    } else {
      next();
    }
  }
});
router.afterEach((to) => {
  const defaultTitle = 'Hệ thống quản lý chuyến bay';
  document.title = to.meta?.title || defaultTitle;
});