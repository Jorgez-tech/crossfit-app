<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>CrossFit Box Dashboard</h1>
      <div class="user-info">
        <span>Bienvenido, {{ authStore.userName }}</span>
        <span class="user-role">{{ authStore.isTrainer ? 'Entrenador' : 'Atleta' }}</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </header>

    <nav class="dashboard-nav">
      <router-link to="/dashboard" class="nav-item" exact-active-class="active">
        <i class="icon"></i>
        Inicio
      </router-link>
      
      <router-link to="/wods" class="nav-item" active-class="active">
        <i class="icon"></i>
        WODs
      </router-link>
      
      <router-link to="/records" class="nav-item" active-class="active">
        <i class="icon"></i>
        Records
      </router-link>
      
      <router-link 
        v-if="authStore.isTrainer" 
        to="/members" 
        class="nav-item" 
        active-class="active"
      >
        <i class="icon"></i>
        Miembros
      </router-link>
    </nav>

    <main class="dashboard-content">
      <div v-if="$route.path === '/dashboard'" class="dashboard-home">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>WODs Disponibles</h3>
            <p class="stat-number">{{ stats.totalWods }}</p>
          </div>
          
          <div class="stat-card">
            <h3>Mis Records</h3>
            <p class="stat-number">{{ stats.myRecords }}</p>
          </div>
          
          <div v-if="authStore.isTrainer" class="stat-card">
            <h3>Total Miembros</h3>
            <p class="stat-number">{{ stats.totalMembers }}</p>
          </div>
          
          <div class="stat-card">
            <h3>Última Actividad</h3>
            <p class="stat-text">{{ stats.lastActivity }}</p>
          </div>
        </div>

        <div class="recent-activity">
          <h3>Actividad Reciente</h3>
          <div v-if="recentWods.length > 0" class="activity-list">
            <div 
              v-for="wod in recentWods" 
              :key="wod.id" 
              class="activity-item"
            >
              <h4>{{ wod.name }}</h4>
              <p>{{ wod.mode }}</p>
              <small>{{ formatDate(wod.created_at) }}</small>
            </div>
          </div>
          <p v-else class="no-activity">No hay actividad reciente</p>
        </div>
      </div>
      
      <!-- Aquí se renderizan las rutas hijas -->
      <router-view v-else />
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/main';
import apiService from '../services/api';
import logger from '../utils/logger';

export default {
  name: 'DashboardHome',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const log = logger.scoped('Dashboard');
    
    const stats = ref({
      totalWods: 0,
      myRecords: 0,
      totalMembers: 0,
      lastActivity: 'Hoy'
    });
    
    const recentWods = ref([]);
    const loading = ref(true);

    const loadDashboardData = async () => {
      try {
        // Cargar WODs
        const wodsResponse = await apiService.getWods();
        if (wodsResponse.data.status === 'OK') {
          stats.value.totalWods = wodsResponse.data.data.length;
          recentWods.value = wodsResponse.data.data.slice(0, 3); // Últimos 3 WODs
        }

        // Cargar records del usuario actual
        const recordsResponse = await apiService.getRecords();
        if (recordsResponse.data.status === 'OK') {
          // Filtrar records del usuario actual si es atleta
          const userRecords = recordsResponse.data.data.filter(record => 
            record.user_id === authStore.user?.id
          );
          stats.value.myRecords = userRecords.length;
        }

        // Si es entrenador, cargar estadísticas de miembros
        if (authStore.isTrainer) {
          const membersResponse = await apiService.getMembers();
          if (membersResponse.data.status === 'OK') {
            stats.value.totalMembers = membersResponse.data.data.length;
          }
        }
      } catch (error) {
        log.error('Fallo cargando datos del dashboard', error);
      } finally {
        loading.value = false;
      }
    };

    const logout = async () => {
      authStore.logout();
      router.push('/login');
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    onMounted(() => {
      // Verificar autenticación
      if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
      }
      
      loadDashboardData();
    });

    return {
      authStore,
      stats,
      recentWods,
      loading,
      logout,
      formatDate
    };
  }
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-role {
  background-color: #4CAF50;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.dashboard-nav {
  background-color: #34495e;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-item {
  color: #bdc3c7;
  text-decoration: none;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.nav-item:hover {
  color: white;
  border-bottom-color: #4CAF50;
}

.nav-item.active {
  color: white;
  border-bottom-color: #4CAF50;
}

.icon {
  font-size: 1.2rem;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
}

.dashboard-home {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4CAF50;
  margin: 0;
}

.stat-text {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 0;
}

.recent-activity {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recent-activity h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.activity-item h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.activity-item p {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
}

.activity-item small {
  color: #adb5bd;
}

.no-activity {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .dashboard-nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
