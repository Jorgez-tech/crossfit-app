<template>
  <div class="trainer-dashboard" data-cy="trainer-dashboard">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1>Panel de Entrenador</h1>
        <p data-cy="welcome-message">Bienvenido, <strong>{{ authStore.user?.name }}</strong></p>
        <p class="subtitle">Gestiona tu box, WODs y atletas desde un solo lugar</p>
      </div>
      
      <div class="quick-actions">
        <button @click="showCreateWodModal = true" class="action-btn primary" data-cy="create-wod-button">
          <span class="icon">+</span>
          Crear WOD
        </button>
        <button @click="$router.push('/members')" class="action-btn secondary" data-cy="manage-members-link">
          <span class="icon">👥</span>
          Gestionar Atletas
        </button>
        <button @click="showReportsModal = true" class="action-btn tertiary">
          <span class="icon">📊</span>
          Ver Reportes
        </button>
      </div>
    </div>

    <!-- Estadísticas principales -->
    <div class="stats-grid" data-cy="trainer-stats">
      <div class="stat-card">
        <div class="stat-icon">🏋️‍♂️</div>
        <div class="stat-content">
          <h3>{{ stats.totalWods }}</h3>
          <p>WODs Creados</p>
          <small>+{{ stats.newWodsThisWeek }} esta semana</small>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ stats.totalMembers }}</h3>
          <p>Atletas Activos</p>
          <small>{{ stats.activeToday }} entrenaron hoy</small>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>{{ stats.totalRecords }}</h3>
          <p>Records Registrados</p>
          <small>+{{ stats.newRecordsThisWeek }} esta semana</small>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <h3>{{ stats.averageAttendance }}%</h3>
          <p>Asistencia Promedio</p>
          <small class="trend positive">+5% vs mes anterior</small>
        </div>
      </div>
    </div>

    <!-- Secciones principales -->
    <div class="dashboard-content">
      <!-- WODs Recientes -->
      <div class="content-section">
        <div class="section-header">
          <h2>WODs Recientes</h2>
          <router-link to="/wods" class="view-all-link">Ver todos</router-link>
        </div>
        
        <div v-if="loading.wods" class="loading">Cargando WODs...</div>
        <div v-else-if="recentWods.length === 0" class="empty-state">
          <p>No hay WODs creados todavía</p>
          <button @click="showCreateWodModal = true" class="create-btn">
            Crear primer WOD
          </button>
        </div>
        <div v-else class="wods-list">
          <div 
            v-for="wod in recentWods" 
            :key="wod.id" 
            class="wod-card"
          >
            <div class="wod-header">
              <h3>{{ wod.name }}</h3>
              <span class="wod-mode">{{ wod.mode }}</span>
            </div>
            <p class="wod-description">{{ truncateText(wod.description, 100) }}</p>
            <div class="wod-meta">
              <span class="wod-date">{{ formatDate(wod.created_at) }}</span>
              <span class="wod-records">{{ getWodRecordsCount(wod.id) }} records</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Atletas Activos -->
      <div class="content-section">
        <div class="section-header">
          <h2>Atletas Más Activos</h2>
          <router-link to="/members" class="view-all-link">Ver todos</router-link>
        </div>
        
        <div v-if="loading.members" class="loading">Cargando atletas...</div>
        <div v-else-if="activeMembers.length === 0" class="empty-state">
          <p>No hay atletas registrados</p>
        </div>
        <div v-else class="members-list">
          <div 
            v-for="member in activeMembers" 
            :key="member.id" 
            class="member-card"
          >
            <div class="member-avatar">
              {{ getInitials(member.name) }}
            </div>
            <div class="member-info">
              <h4>{{ member.name }}</h4>
              <p>{{ member.email }}</p>
              <div class="member-stats">
                <span>{{ getMemberRecordsCount(member.id) }} records</span>
                <span>Desde {{ formatDate(member.created_at) }}</span>
              </div>
            </div>
            <div class="member-actions">
              <button @click="viewMemberDetails(member)" class="view-btn">
                Ver perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Records Recientes -->
      <div class="content-section">
        <div class="section-header">
          <h2>Records Recientes</h2>
          <router-link to="/records" class="view-all-link">Ver todos</router-link>
        </div>
        
        <div v-if="loading.records" class="loading">Cargando records...</div>
        <div v-else-if="recentRecords.length === 0" class="empty-state">
          <p>No hay records registrados</p>
        </div>
        <div v-else class="records-list">
          <div 
            v-for="record in recentRecords" 
            :key="record.id" 
            class="record-card"
          >
            <div class="record-info">
              <h4>{{ getWodName(record.wod_id) }}</h4>
              <p class="record-result">{{ record.result }}</p>
              <div class="record-meta">
                <span>{{ getUserName(record.user_id) }}</span>
                <span>{{ formatDate(record.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear WOD rápido -->
    <div v-if="showCreateWodModal" class="modal-overlay" @click="closeCreateWodModal">
      <div class="modal-content" @click.stop>
        <h2>Crear WOD Rápido</h2>
        <form @submit.prevent="createQuickWod">
          <div class="form-group">
            <label for="wodName">Nombre del WOD:</label>
            <input 
              id="wodName"
              v-model="quickWod.name" 
              type="text" 
              required 
              placeholder="Ej: Fran, Grace, WOD del día..."
            />
          </div>
          
          <div class="form-group">
            <label for="wodMode">Modalidad:</label>
            <select id="wodMode" v-model="quickWod.mode" required>
              <option value="">Seleccionar modalidad</option>
              <option value="For Time">For Time</option>
              <option value="AMRAP">AMRAP</option>
              <option value="EMOM">EMOM</option>
              <option value="Tabata">Tabata</option>
              <option value="Strength">Strength</option>
              <option value="MetCon">MetCon</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="wodDescription">Descripción:</label>
            <textarea 
              id="wodDescription"
              v-model="quickWod.description" 
              rows="4"
              required
              placeholder="21-15-9&#10;Thrusters (95/65)&#10;Pull-ups"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="creatingWod">
              {{ creatingWod ? 'Creando...' : 'Crear WOD' }}
            </button>
            <button type="button" @click="closeCreateWodModal" class="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de reportes -->
    <div v-if="showReportsModal" class="modal-overlay" @click="showReportsModal = false">
      <div class="modal-content large" @click.stop>
        <h2>Reportes y Estadísticas</h2>
        <div class="reports-grid">
          <div class="report-card">
            <h3>Asistencia por Semana</h3>
            <div class="chart-placeholder">
              📊 Gráfico de asistencia
            </div>
          </div>
          <div class="report-card">
            <h3>WODs Más Populares</h3>
            <div class="popular-wods">
              <div v-for="(wod, index) in popularWods" :key="wod.id" class="popular-wod">
                <span class="rank">{{ index + 1 }}</span>
                <span class="name">{{ wod.name }}</span>
                <span class="count">{{ wod.records_count }} records</span>
              </div>
            </div>
          </div>
        </div>
        <button @click="showReportsModal = false" class="close-btn">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore, useWodStore, useMemberStore, useRecordStore } from '../stores/main';
import apiService from '../services/api';
import logger from '../utils/logger';

export default {
  name: 'TrainerDashboard',
  setup() {
    const authStore = useAuthStore();
    const wodStore = useWodStore();
    const memberStore = useMemberStore();
    const recordStore = useRecordStore();
    const log = logger.scoped('TrainerDashboard');
    
    const loading = reactive({
      wods: false,
      members: false,
      records: false
    });
    
    const showCreateWodModal = ref(false);
    const showReportsModal = ref(false);
    const creatingWod = ref(false);
    
    const quickWod = reactive({
      name: '',
      mode: '',
      description: ''
    });
    
    const stats = reactive({
      totalWods: 0,
      newWodsThisWeek: 0,
      totalMembers: 0,
      activeToday: 0,
      totalRecords: 0,
      newRecordsThisWeek: 0,
      averageAttendance: 0
    });
    
    const recentWods = computed(() => 
      wodStore.wods.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    );
    
    const activeMembers = computed(() => 
      memberStore.members
        .filter(member => member.role === 'atleta')
        .slice(0, 6)
        .sort((a, b) => getMemberRecordsCount(b.id) - getMemberRecordsCount(a.id))
    );
    
    const recentRecords = computed(() => 
      recordStore.records.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    );
    
    const popularWods = computed(() => {
      const wodRecordCounts = {};
      recordStore.records.forEach(record => {
        wodRecordCounts[record.wod_id] = (wodRecordCounts[record.wod_id] || 0) + 1;
      });
      
      return wodStore.wods
        .map(wod => ({
          ...wod,
          records_count: wodRecordCounts[wod.id] || 0
        }))
        .sort((a, b) => b.records_count - a.records_count)
        .slice(0, 5);
    });

    const loadDashboardData = async () => {
      try {
        // Cargar datos en paralelo
        await Promise.all([
          loadWods(),
          loadMembers(),
          loadRecords()
        ]);
        
        calculateStats();
      } catch (error) {
        log.error('Error cargando datos del dashboard', error);
      }
    };

    const loadWods = async () => {
      loading.wods = true;
      try {
        const response = await apiService.getWods();
        if (response.data.status === 'OK') {
          wodStore.setWods(response.data.data);
        }
      } catch (error) {
        log.error('Error cargando WODs', error);
      } finally {
        loading.wods = false;
      }
    };

    const loadMembers = async () => {
      loading.members = true;
      try {
        const response = await apiService.getMembers();
        if (response.data.status === 'OK') {
          memberStore.setMembers(response.data.data);
        }
      } catch (error) {
        log.error('Error cargando miembros', error);
      } finally {
        loading.members = false;
      }
    };

    const loadRecords = async () => {
      loading.records = true;
      try {
        const response = await apiService.getRecords();
        if (response.data.status === 'OK') {
          recordStore.setRecords(response.data.data);
        }
      } catch (error) {
        log.error('Error cargando records', error);
      } finally {
        loading.records = false;
      }
    };

    const calculateStats = () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      stats.totalWods = wodStore.wods.length;
      stats.newWodsThisWeek = wodStore.wods.filter(wod => 
        new Date(wod.created_at) >= weekAgo
      ).length;
      
      stats.totalMembers = memberStore.members.filter(m => m.role === 'atleta').length;
      stats.activeToday = Math.floor(stats.totalMembers * 0.3); // Simulado
      
      stats.totalRecords = recordStore.records.length;
      stats.newRecordsThisWeek = recordStore.records.filter(record => 
        new Date(record.created_at) >= weekAgo
      ).length;
      
      stats.averageAttendance = 75 + Math.floor(Math.random() * 20); // Simulado
    };

    const createQuickWod = async () => {
      creatingWod.value = true;
      try {
        const response = await apiService.createWod(quickWod);
        if (response.data.status === 'OK') {
          await loadWods();
          closeCreateWodModal();
        }
      } catch (error) {
        log.error('Error creando WOD', error);
        alert('Error al crear el WOD');
      } finally {
        creatingWod.value = false;
      }
    };

    const closeCreateWodModal = () => {
      showCreateWodModal.value = false;
      Object.keys(quickWod).forEach(key => quickWod[key] = '');
    };

    const viewMemberDetails = (member) => {
      // Implementar vista detallada del miembro
      log.debug('Solicitud de detalle de miembro', { id: member.id });
    };

    const getWodRecordsCount = (wodId) => {
      return recordStore.records.filter(record => record.wod_id === wodId).length;
    };

    const getMemberRecordsCount = (memberId) => {
      return recordStore.records.filter(record => record.user_id === memberId).length;
    };

    const getWodName = (wodId) => {
      const wod = wodStore.wods.find(w => w.id === wodId);
      return wod ? wod.name : 'WOD desconocido';
    };

    const getUserName = (userId) => {
      const user = memberStore.members.find(m => m.id === userId);
      return user ? user.name : 'Usuario desconocido';
    };

    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const truncateText = (text, length) => {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };

    onMounted(() => {
      loadDashboardData();
    });

    return {
      authStore,
      loading,
      showCreateWodModal,
      showReportsModal,
      creatingWod,
      quickWod,
      stats,
      recentWods,
      activeMembers,
      recentRecords,
      popularWods,
      createQuickWod,
      closeCreateWodModal,
      viewMemberDetails,
      getWodRecordsCount,
      getMemberRecordsCount,
      getWodName,
      getUserName,
      getInitials,
      truncateText,
      formatDate
    };
  }
};
</script>

<style scoped>
.trainer-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.welcome-section h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 300;
}

.welcome-section p {
  margin: 0;
  opacity: 0.9;
}

.subtitle {
  font-style: italic;
  margin-top: 0.5rem !important;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
}

.action-btn.primary {
  background: white;
  color: #667eea;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-btn.tertiary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-content p {
  margin: 0.25rem 0;
  color: #6c757d;
  font-weight: 500;
}

.stat-content small {
  color: #28a745;
  font-size: 0.8rem;
}

.trend.positive {
  color: #28a745;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f8f9fa;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.create-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.wods-list, .members-list, .records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wod-card, .member-card, .record-card {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.wod-card:hover, .member-card:hover, .record-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wod-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.wod-header h3 {
  margin: 0;
  color: #2c3e50;
}

.wod-mode {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.wod-description {
  color: #6c757d;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.wod-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.member-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.member-info {
  flex: 1;
}

.member-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.member-info p {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.member-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.view-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.record-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.record-result {
  font-size: 1.1rem;
  font-weight: bold;
  color: #28a745;
  margin: 0.5rem 0;
}

.record-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
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

.modal-content.large {
  max-width: 800px;
}

.modal-content h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn, .cancel-btn, .close-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn {
  background: #667eea;
  color: white;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn, .close-btn {
  background: #6c757d;
  color: white;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.report-card {
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.chart-placeholder {
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #6c757d;
  font-size: 1.2rem;
}

.popular-wods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.popular-wod {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.rank {
  width: 24px;
  height: 24px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.name {
  flex: 1;
  font-weight: 500;
}

.count {
  color: #6c757d;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .trainer-dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    justify-content: center;
  }
}
</style>
