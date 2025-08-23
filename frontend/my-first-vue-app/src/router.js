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
    name: 'Home',
    component: HomeView,
    meta: {
      requiresAuth: false,
      title: 'Inicio',
      breadcrumb: 'Inicio'
    }
  },
  {
    path: '/todos',
    name: 'Todos',
    component: TodoList,
    meta: {
      requiresAuth: false,
      title: 'Lista de Tareas',
      breadcrumb: 'Tareas'
    }
  },
  {
    path: '/crossfit',
    name: 'Crossfit',
    component: CrossfitWods,
    meta: {
      requiresAuth: false,
      title: 'CrossFit WODs',
      breadcrumb: 'CrossFit'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
    meta: {
      requiresAuth: false,
      hideForAuthenticated: true,
      title: 'Iniciar Sesión',
      breadcrumb: 'Login'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Panel Principal',
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: '/trainer',
    name: 'TrainerDashboard',
    component: () => import('./components/TrainerDashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'entrenador',
      title: 'Panel de Entrenador',
      breadcrumb: 'Panel de Entrenador',
      permissions: ['manage_wods', 'manage_members', 'view_all_records']
    }
  },
  {
    path: '/athlete',
    name: 'AthleteDashboard',
    component: () => import('./components/AthleteDashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'atleta',
      title: 'Panel de Atleta',
      breadcrumb: 'Panel de Atleta',
      permissions: ['view_wods', 'manage_own_records']
    }
  },
  {
    path: '/wods',
    name: 'WODs',
    component: () => import('./components/WodsList.vue'),
    meta: {
      requiresAuth: true,
      title: 'WODs',
      breadcrumb: 'WODs',
      permissions: ['view_wods']
    }
  },
  {
    path: '/wods/create',
    name: 'CreateWOD',
    component: () => import('./components/WodsList.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'entrenador',
      title: 'Crear WOD',
      breadcrumb: 'Crear WOD',
      permissions: ['manage_wods']
    }
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('./components/MembersList.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'entrenador',
      title: 'Gestión de Miembros',
      breadcrumb: 'Miembros',
      permissions: ['manage_members']
    }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('./components/RecordsList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Records',
      breadcrumb: 'Records',
      permissions: ['view_records']
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./components/UserProfile.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mi Perfil',
      breadcrumb: 'Perfil'
    }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: () => import('./components/AccessDenied.vue'),
    meta: {
      requiresAuth: false,
      title: 'Acceso Denegado',
      breadcrumb: 'Acceso Denegado'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/access-denied'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Función para verificar permisos
function hasPermission(userRole, requiredPermissions) {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  const rolePermissions = {
    entrenador: [
      'manage_wods',
      'manage_members',
      'view_all_records',
      'view_wods',
      'manage_own_records',
      'view_records'
    ],
    atleta: [
      'view_wods',
      'manage_own_records',
      'view_records'
    ]
  };

  const userPermissions = rolePermissions[userRole] || [];
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}

// Guard de navegación global mejorado
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  try {
    // Verificar estado de autenticación
    await authStore.checkAuth();

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const hideForAuthenticated = to.matched.some(record => record.meta.hideForAuthenticated);
    const requiresRole = to.matched.find(record => record.meta.requiresRole)?.meta.requiresRole;
    const requiredPermissions = to.matched.find(record => record.meta.permissions)?.meta.permissions;

    console.log('Navegación:', {
      to: to.path,
      requiresAuth,
      isAuthenticated: authStore.isAuthenticated,
      userRole: authStore.user?.role,
      requiresRole,
      requiredPermissions
    });

    // 1. Verificar autenticación
    if (requiresAuth && !authStore.isAuthenticated) {
      console.warn('Acceso denegado: usuario no autenticado');
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }

    // 2. Redirigir usuarios autenticados fuera de login
    if (hideForAuthenticated && authStore.isAuthenticated) {
      const userRole = authStore.user?.role;
      const redirectPath = userRole === 'entrenador' ? '/trainer' : '/athlete';
      return next(redirectPath);
    }

    // 3. Verificar rol específico
    if (requiresRole && authStore.user?.role !== requiresRole) {
      console.warn('Acceso denegado: rol insuficiente', {
        required: requiresRole,
        actual: authStore.user?.role
      });
      return next('/access-denied');
    }

    // 4. Verificar permisos específicos
    if (requiredPermissions && !hasPermission(authStore.user?.role, requiredPermissions)) {
      console.warn('Acceso denegado: permisos insuficientes', {
        required: requiredPermissions,
        userRole: authStore.user?.role
      });
      return next('/access-denied');
    }

    // 5. Redirigir a panel específico desde dashboard general
    if (to.path === '/dashboard' && authStore.isAuthenticated) {
      const userRole = authStore.user?.role;
      const redirectPath = userRole === 'entrenador' ? '/trainer' : '/athlete';
      return next(redirectPath);
    }

    // 6. Permitir navegación
    next();

  } catch (error) {
    console.error('Error en guard de navegación:', error);
    // En caso de error, redirigir a login
    authStore.logout();
    next('/login');
  }
});

// Guard después de la navegación para actualizar título
router.afterEach((to) => {
  const title = to.meta.title;
  if (title) {
    document.title = `${title} - CrossFit App`;
  }
});

console.log('Router configurado con', routes.length, 'rutas y guards avanzados de autenticación y permisos');

export default router;