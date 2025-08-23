<template>
  <div class="access-denied">
    <div class="access-denied-content">
      <div class="error-icon">
        🚫
      </div>
      
      <h1>Acceso Denegado</h1>
      
      <div class="error-message">
        <p v-if="!authStore.isAuthenticated">
          Necesitas iniciar sesión para acceder a esta página.
        </p>
        <p v-else-if="reason === 'insufficient_role'">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <p v-else-if="reason === 'insufficient_permissions'">
          Tu rol actual no tiene los permisos requeridos para esta funcionalidad.
        </p>
        <p v-else>
          No tienes autorización para acceder a esta página.
        </p>
      </div>

      <div class="error-details" v-if="authStore.isAuthenticated">
        <div class="user-info">
          <h3>Tu información actual:</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Usuario:</strong> {{ authStore.user?.name }}
            </div>
            <div class="info-item">
              <strong>Email:</strong> {{ authStore.user?.email }}
            </div>
            <div class="info-item">
              <strong>Rol:</strong> 
              <span class="role-badge" :class="authStore.user?.role">
                {{ getRoleDisplayName(authStore.user?.role) }}
              </span>
            </div>
          </div>
        </div>

        <div class="permissions-info">
          <h3>Tus permisos actuales:</h3>
          <div class="permissions-list">
            <div 
              v-for="permission in userPermissions" 
              :key="permission"
              class="permission-item"
            >
              ✅ {{ getPermissionDisplayName(permission) }}
            </div>
          </div>
        </div>
      </div>

      <div class="suggested-actions">
        <h3>¿Qué puedes hacer?</h3>
        
        <div v-if="!authStore.isAuthenticated" class="action-section">
          <p>Inicia sesión para acceder a las funcionalidades de la aplicación:</p>
          <router-link to="/login" class="action-btn primary">
            <span class="icon">🔑</span>
            Iniciar Sesión
          </router-link>
        </div>

        <div v-else class="action-section">
          <p>Puedes intentar las siguientes opciones:</p>
          
          <div class="actions-grid">
            <router-link 
              :to="getRecommendedRoute()" 
              class="action-btn primary"
            >
              <span class="icon">🏠</span>
              Ir a {{ getRecommendedRouteText() }}
            </router-link>
            
            <router-link 
              v-if="authStore.user?.role === 'atleta'"
              to="/wods" 
              class="action-btn secondary"
            >
              <span class="icon">🏋️‍♂️</span>
              Ver WODs
            </router-link>
            
            <router-link 
              to="/records" 
              class="action-btn secondary"
            >
              <span class="icon">📊</span>
              Mis Records
            </router-link>
            
            <router-link 
              to="/profile" 
              class="action-btn tertiary"
            >
              <span class="icon">👤</span>
              Mi Perfil
            </router-link>
          </div>
        </div>

        <div class="contact-section">
          <p>Si crees que deberías tener acceso a esta página:</p>
          <div class="contact-options">
            <button @click="contactAdmin" class="contact-btn">
              <span class="icon">✉️</span>
              Contactar Administrador
            </button>
            <button @click="reportIssue" class="contact-btn">
              <span class="icon">🐛</span>
              Reportar Problema
            </button>
          </div>
        </div>
      </div>

      <div class="back-navigation">
        <button @click="goBack" class="back-btn">
          <span class="icon">⬅️</span>
          Volver Atrás
        </button>
        <button @click="goHome" class="home-btn">
          <span class="icon">🏠</span>
          Ir al Inicio
        </button>
      </div>
    </div>

    <!-- Información adicional para desarrollo -->
    <div v-if="isDevelopment" class="debug-info">
      <h4>Información de Debug:</h4>
      <div class="debug-content">
        <div><strong>Ruta solicitada:</strong> {{ $route.fullPath }}</div>
        <div><strong>Método de navegación:</strong> {{ $route.meta?.method || 'Directo' }}</div>
        <div><strong>Autenticado:</strong> {{ authStore.isAuthenticated ? 'Sí' : 'No' }}</div>
        <div><strong>Rol usuario:</strong> {{ authStore.user?.role || 'N/A' }}</div>
        <div><strong>Permisos requeridos:</strong> {{ $route.meta?.permissions?.join(', ') || 'Ninguno específico' }}</div>
        <div><strong>Rol requerido:</strong> {{ $route.meta?.requiresRole || 'Ninguno específico' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/main';

export default {
  name: 'AccessDenied',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const reason = computed(() => {
      if (!authStore.isAuthenticated) return 'not_authenticated';
      if (route.query.reason) return route.query.reason;
      return 'unauthorized';
    });
    
    const userPermissions = computed(() => {
      const role = authStore.user?.role;
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
      
      return rolePermissions[role] || [];
    });

    const getRoleDisplayName = (role) => {
      const roleNames = {
        entrenador: 'Entrenador',
        atleta: 'Atleta'
      };
      return roleNames[role] || 'Desconocido';
    };

    const getPermissionDisplayName = (permission) => {
      const permissionNames = {
        manage_wods: 'Gestionar WODs',
        manage_members: 'Gestionar Miembros',
        view_all_records: 'Ver todos los Records',
        view_wods: 'Ver WODs',
        manage_own_records: 'Gestionar mis Records',
        view_records: 'Ver Records'
      };
      return permissionNames[permission] || permission;
    };

    const getRecommendedRoute = () => {
      if (!authStore.isAuthenticated) return '/login';
      return authStore.user?.role === 'entrenador' ? '/trainer' : '/athlete';
    };

    const getRecommendedRouteText = () => {
      if (!authStore.isAuthenticated) return 'Login';
      return authStore.user?.role === 'entrenador' ? 'Panel de Entrenador' : 'Panel de Atleta';
    };

    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1);
      } else {
        goHome();
      }
    };

    const goHome = () => {
      router.push(getRecommendedRoute());
    };

    const contactAdmin = () => {
      // En una implementación real, esto podría abrir un modal de contacto
      // o redirigir a un sistema de tickets
      alert('Funcionalidad de contacto en desarrollo.\n\nPor favor contacta al administrador del sistema para solicitar permisos adicionales.');
    };

    const reportIssue = () => {
      // En una implementación real, esto podría enviar un reporte automático
      const issueData = {
        route: route.fullPath,
        user: authStore.user?.email,
        role: authStore.user?.role,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      console.log('Reporte de problema:', issueData);
      alert('Reporte enviado.\n\nLa información del problema ha sido registrada para revisión.');
    };

    return {
      authStore,
      reason,
      userPermissions,
      isDevelopment,
      getRoleDisplayName,
      getPermissionDisplayName,
      getRecommendedRoute,
      getRecommendedRouteText,
      goBack,
      goHome,
      contactAdmin,
      reportIssue
    };
  }
};
</script>

<style scoped>
.access-denied {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.access-denied-content {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

h1 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 2.5rem;
  font-weight: 300;
}

.error-message {
  margin-bottom: 2rem;
}

.error-message p {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.6;
}

.error-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
}

.error-details h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.user-info {
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-badge.entrenador {
  background: #e3f2fd;
  color: #1976d2;
}

.role-badge.atleta {
  background: #f3e5f5;
  color: #7b1fa2;
}

.permissions-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  font-size: 0.9rem;
}

.suggested-actions {
  margin: 2rem 0;
}

.suggested-actions h3 {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
}

.action-section {
  margin-bottom: 2rem;
}

.action-section p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.action-btn.tertiary {
  background: transparent;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn.primary:hover {
  background: #5a67d8;
}

.action-btn.secondary:hover {
  background: #e9ecef;
}

.action-btn.tertiary:hover {
  background: #f8f9fa;
}

.icon {
  font-size: 1.2rem;
}

.contact-section {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.contact-section p {
  margin: 0 0 1rem 0;
  color: #856404;
}

.contact-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.contact-btn:hover {
  background: #e0a800;
  transform: translateY(-1px);
}

.back-navigation {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.back-btn, .home-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover, .home-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.debug-info {
  background: #263238;
  color: #eceff1;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  text-align: left;
}

.debug-info h4 {
  margin: 0 0 1rem 0;
  color: #81c784;
}

.debug-content {
  display: grid;
  gap: 0.5rem;
}

.debug-content div {
  display: flex;
  gap: 0.5rem;
}

.debug-content strong {
  color: #81c784;
  min-width: 180px;
}

@media (max-width: 768px) {
  .access-denied {
    padding: 1rem;
  }

  .access-denied-content {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .back-navigation {
    flex-direction: column;
  }

  .contact-options {
    flex-direction: column;
  }

  .debug-content strong {
    min-width: auto;
  }
}
</style>
