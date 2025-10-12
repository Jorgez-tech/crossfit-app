<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="profile-avatar">
        {{ getInitials(authStore.user?.name) }}
      </div>
      <div class="profile-info">
        <h1>{{ authStore.user?.name }}</h1>
        <p class="profile-email">{{ authStore.user?.email }}</p>
        <span class="profile-role" :class="authStore.user?.role">
          {{ getRoleDisplayName(authStore.user?.role) }}
        </span>
      </div>
      <div class="profile-actions">
        <button @click="editMode = !editMode" class="edit-btn">
          {{ editMode ? 'Cancelar' : 'Editar Perfil' }}
        </button>
      </div>
    </div>

    <div class="profile-content">
      <!-- Formulario de edición -->
      <div v-if="editMode" class="edit-section">
        <h2>Editar Información Personal</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="userName">Nombre completo:</label>
            <input 
              id="userName"
              v-model="editForm.name" 
              type="text" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="userEmail">Email:</label>
            <input 
              id="userEmail"
              v-model="editForm.email" 
              type="email" 
              required 
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="updating">
              {{ updating ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button type="button" @click="editMode = false" class="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- Información del perfil -->
      <div v-else class="info-sections">
        <div class="info-section">
          <h2>Información Personal</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Nombre:</strong>
              <span>{{ authStore.user?.name }}</span>
            </div>
            <div class="info-item">
              <strong>Email:</strong>
              <span>{{ authStore.user?.email }}</span>
            </div>
            <div class="info-item">
              <strong>Rol:</strong>
              <span class="role-badge" :class="authStore.user?.role">
                {{ getRoleDisplayName(authStore.user?.role) }}
              </span>
            </div>
            <div class="info-item">
              <strong>Miembro desde:</strong>
              <span>{{ formatDate(authStore.user?.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Estadísticas del usuario -->
        <div class="info-section">
          <h2>Mis Estadísticas</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ userStats.totalRecords }}</div>
              <div class="stat-label">Records Registrados</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ userStats.totalWods }}</div>
              <div class="stat-label">WODs Completados</div>
            </div>
            <div class="stat-card" v-if="authStore.user?.role === 'entrenador'">
              <div class="stat-number">{{ userStats.createdWods }}</div>
              <div class="stat-label">WODs Creados</div>
            </div>
            <div class="stat-card" v-if="authStore.user?.role === 'entrenador'">
              <div class="stat-number">{{ userStats.managedMembers }}</div>
              <div class="stat-label">Atletas Gestionados</div>
            </div>
          </div>
        </div>

        <!-- Actividad reciente -->
        <div class="info-section">
          <h2>Actividad Reciente</h2>
          <div v-if="recentActivity.length === 0" class="empty-state">
            No hay actividad reciente registrada.
          </div>
          <div v-else class="activity-list">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-description">{{ activity.description }}</div>
                <div class="activity-date">{{ formatDateTime(activity.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de seguridad -->
    <div class="security-section">
      <h2>Seguridad</h2>
      <div class="security-options">
        <button @click="showChangePassword = true" class="security-btn">
          <span class="icon">🔐</span>
          Cambiar Contraseña
        </button>
        <button @click="logout" class="security-btn danger">
          <span class="icon">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Modal para cambiar contraseña -->
    <div v-if="showChangePassword" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <h2>Cambiar Contraseña</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label for="currentPassword">Contraseña actual:</label>
            <input 
              id="currentPassword"
              v-model="passwordForm.current" 
              type="password" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="newPassword">Nueva contraseña:</label>
            <input 
              id="newPassword"
              v-model="passwordForm.new" 
              type="password" 
              required 
              minlength="6"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar nueva contraseña:</label>
            <input 
              id="confirmPassword"
              v-model="passwordForm.confirm" 
              type="password" 
              required 
              minlength="6"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="changingPassword">
              {{ changingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
            </button>
            <button type="button" @click="closePasswordModal" class="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, useWodStore, useMemberStore, useRecordStore } from '../stores/main';
import apiService from '../services/api';
import logger from '../utils/logger';

export default {
  name: 'UserProfile',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const wodStore = useWodStore();
    const memberStore = useMemberStore();
    const recordStore = useRecordStore();
    
    const editMode = ref(false);
    const updating = ref(false);
    const showChangePassword = ref(false);
    const changingPassword = ref(false);
    
    const editForm = reactive({
      name: '',
      email: ''
    });
    
    const passwordForm = reactive({
      current: '',
      new: '',
      confirm: ''
    });
    
    const userStats = reactive({
      totalRecords: 0,
      totalWods: 0,
      createdWods: 0,
      managedMembers: 0
    });
    
    const recentActivity = ref([]);

    const log = logger.scoped('UserProfile');

    const loadUserData = async () => {
      try {
        // Cargar datos necesarios para estadísticas
        await Promise.all([
          loadRecords(),
          loadWods(),
          loadMembers()
        ]);
        
        calculateUserStats();
        generateRecentActivity();
        
        // Inicializar formulario de edición
        editForm.name = authStore.user?.name || '';
        editForm.email = authStore.user?.email || '';
        
      } catch (error) {
        log.error('Error cargando datos del usuario', error);
      }
    };

    const loadRecords = async () => {
      try {
        const response = await apiService.getRecords();
        if (response.data.status === 'OK') {
          recordStore.setRecords(response.data.data);
        }
      } catch (error) {
        log.error('Error cargando records', error);
      }
    };

    const loadWods = async () => {
      try {
        const response = await apiService.getWods();
        if (response.data.status === 'OK') {
          wodStore.setWods(response.data.data);
        }
      } catch (error) {
        log.error('Error cargando WODs', error);
      }
    };

    const loadMembers = async () => {
      if (authStore.user?.role !== 'entrenador') return;
      
      try {
        const response = await apiService.getMembers();
        if (response.data.status === 'OK') {
          memberStore.setMembers(response.data.data);
        }
      } catch (error) {
        log.error('Error cargando miembros', error);
      }
    };

    const calculateUserStats = () => {
      const userId = authStore.user?.id;
      
      // Records del usuario
      userStats.totalRecords = recordStore.records.filter(r => r.user_id === userId).length;
      
      // WODs únicos completados
      const completedWodIds = new Set(
        recordStore.records
          .filter(r => r.user_id === userId)
          .map(r => r.wod_id)
      );
      userStats.totalWods = completedWodIds.size;
      
      if (authStore.user?.role === 'entrenador') {
        // WODs creados (aquí asumimos que todos los WODs fueron creados por entrenadores)
        userStats.createdWods = wodStore.wods.length;
        
        // Atletas gestionados
        userStats.managedMembers = memberStore.members.filter(m => m.role === 'atleta').length;
      }
    };

    const generateRecentActivity = () => {
      const activities = [];
      const userId = authStore.user?.id;
      
      // Actividades basadas en records recientes
      const recentRecords = recordStore.records
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
      
      recentRecords.forEach(record => {
        const wod = wodStore.wods.find(w => w.id === record.wod_id);
        activities.push({
          id: `record-${record.id}`,
          icon: '🏆',
          title: 'Nuevo Record Registrado',
          description: `Completaste ${wod?.name || 'WOD'} con resultado: ${record.result}`,
          date: record.created_at
        });
      });
      
      // Si es entrenador, agregar actividades de creación de WODs
      if (authStore.user?.role === 'entrenador') {
        const recentWods = wodStore.wods
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 2);
        
        recentWods.forEach(wod => {
          activities.push({
            id: `wod-${wod.id}`,
            icon: '💪',
            title: 'Nuevo WOD Creado',
            description: `Creaste el WOD "${wod.name}" (${wod.mode})`,
            date: wod.created_at
          });
        });
      }
      
      // Ordenar por fecha más reciente
      recentActivity.value = activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    };

    const updateProfile = async () => {
      updating.value = true;
      try {
        // Aquí implementarías la llamada a la API para actualizar el perfil
        // const response = await apiService.updateProfile(editForm);
        
        // Simulación de actualización exitosa
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Actualizar el store
        authStore.user.name = editForm.name;
        authStore.user.email = editForm.email;
        
        editMode.value = false;
        alert('Perfil actualizado exitosamente');
        
      } catch (error) {
        log.error('Error actualizando perfil', error);
        alert('Error al actualizar el perfil');
      } finally {
        updating.value = false;
      }
    };

    const changePassword = async () => {
      if (passwordForm.new !== passwordForm.confirm) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      changingPassword.value = true;
      try {
        // Aquí implementarías la llamada a la API para cambiar contraseña
        // const response = await apiService.changePassword(passwordForm);
        
        // Simulación de cambio exitoso
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        closePasswordModal();
        alert('Contraseña cambiada exitosamente');
        
      } catch (error) {
        log.error('Error cambiando contraseña', error);
        alert('Error al cambiar la contraseña');
      } finally {
        changingPassword.value = false;
      }
    };

    const closePasswordModal = () => {
      showChangePassword.value = false;
      Object.keys(passwordForm).forEach(key => passwordForm[key] = '');
    };

    const logout = () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        authStore.logout();
        router.push('/login');
      }
    };

    const getRoleDisplayName = (role) => {
      const roleNames = {
        entrenador: 'Entrenador',
        atleta: 'Atleta'
      };
      return roleNames[role] || 'Desconocido';
    };

    const getInitials = (name) => {
      if (!name) return 'U';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible';
      return new Date(dateString).toLocaleDateString('es-ES');
    };

    const formatDateTime = (dateString) => {
      if (!dateString) return 'No disponible';
      return new Date(dateString).toLocaleString('es-ES');
    };

    onMounted(() => {
      loadUserData();
    });

    return {
      authStore,
      editMode,
      updating,
      showChangePassword,
      changingPassword,
      editForm,
      passwordForm,
      userStats,
      recentActivity,
      updateProfile,
      changePassword,
      closePasswordModal,
      logout,
      getRoleDisplayName,
      getInitials,
      formatDate,
      formatDateTime
    };
  }
};
</script>

<style scoped>
.user-profile {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2rem;
}

.profile-email {
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 1.1rem;
}

.profile-role {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.profile-role.entrenador {
  background: #e3f2fd;
  color: #1976d2;
}

.profile-role.atleta {
  background: #f3e5f5;
  color: #7b1fa2;
}

.edit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.edit-btn:hover {
  background: #5a67d8;
}

.profile-content {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.edit-section, .info-sections {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-section h2, .info-section h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.info-sections {
  display: grid;
  gap: 2rem;
}

.info-section {
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

.activity-list {
  display: grid;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.activity-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.activity-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.activity-date {
  color: #adb5bd;
  font-size: 0.8rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.save-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.security-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.security-section h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.security-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.security-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.security-btn:hover {
  background: #f8f9fa;
}

.security-btn.danger {
  border-color: #dc3545;
  color: #dc3545;
}

.security-btn.danger:hover {
  background: #dc3545;
  color: white;
}

.icon {
  font-size: 1.2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .user-profile {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .security-options {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
