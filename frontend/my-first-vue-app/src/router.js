import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/main';

// Importaciones de componentes
import HomeView from './components/HelloWorld.vue';
import TodoList from './components/TodoList.vue';
import CrossfitWods from './components/CrossfitWods.vue';
import LoginComponent from './components/LoginComponent.vue';
import Dashboard from './components/Dashboard.vue';

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/todos',
    component: TodoList,
    meta: { requiresAuth: false }
  },
  {
    path: '/crossfit',
    component: CrossfitWods,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
    meta: { requiresAuth: false, hideForAuthenticated: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/wods',
    name: 'WODs',
    component: () => import('./components/WodsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('./components/MembersList.vue'),
    meta: { requiresAuth: true, requiresRole: 'entrenador' }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('./components/RecordsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Verificar estado de autenticación
  authStore.checkAuth();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const hideForAuthenticated = to.matched.some(record => record.meta.hideForAuthenticated);
  const requiresRole = to.matched.find(record => record.meta.requiresRole)?.meta.requiresRole;

  if (requiresAuth && !authStore.isAuthenticated) {
    // Ruta requiere autenticación pero el usuario no está autenticado
    next('/login');
  } else if (hideForAuthenticated && authStore.isAuthenticated) {
    // Ruta debe ocultarse para usuarios autenticados (ej: login)
    next('/dashboard');
  } else if (requiresRole && authStore.user?.role !== requiresRole) {
    // Ruta requiere un rol específico
    console.warn('Acceso denegado: rol insuficiente');
    next('/dashboard'); // Redirigir al dashboard
  } else {
    // Permitir navegación
    next();
  }
});

console.log('Router funcionando correctamente con', routes.length - 1, 'rutas y guards de autenticación');

export default router;