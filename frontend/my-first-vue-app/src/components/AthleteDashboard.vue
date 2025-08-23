<template>
  <div class="athlete-dashboard">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1>Panel de Atleta</h1>
        <p>Hola, <strong>{{ authStore.user?.name }}</strong></p>
        <p class="subtitle">Sigue tu progreso y supera tus límites</p>
      </div>
      
      <div class="quick-actions">
        <button @click="showRecordModal = true" class="action-btn primary">
          <span class="icon">📝</span>
          Registrar Record
        </button>
        <button @click="$router.push('/wods')" class="action-btn secondary">
          <span class="icon">🏋️‍♂️</span>
          Ver WODs
        </button>
        <button @click="$router.push('/profile')" class="action-btn tertiary">
          <span class="icon">👤</span>
          Mi Perfil
        </button>
      </div>
    </div>

    <!-- Estadísticas personales -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <h3>{{ personalStats.totalRecords }}</h3>
          <p>Records Registrados</p>
          <small>+{{ personalStats.newRecordsThisWeek }} esta semana</small>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <h3>{{ personalStats.currentStreak }}</h3>
          <p>Días Consecutivos</p>
          <small>{{ personalStats.streakStatus }}</small>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>{{ personalStats.favoriteWodType }}</h3>
          <p>WOD Favorito</p>
          <small>{{ personalStats.favoriteWodCount }} veces completado</small>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <h3>#{{ personalStats.ranking }}</h3>
          <p>Posición en Box</p>
          <small class="trend positive">{{ personalStats.rankingTrend }}</small>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="dashboard-content">
      <!-- WOD del día -->
      <div class="content-section featured">
        <div class="section-header">
          <h2>WOD del Día</h2>
          <span class="date">{{ formatDate(new Date()) }}</span>
        </div>
        
        <div v-if="loading.todayWod" class="loading">Cargando WOD del día...</div>
        <div v-else-if="!todayWod" class="empty-state">
          <p>No hay WOD programado para hoy</p>
          <button @click="$router.push('/wods')" class="explore-btn">
            Explorar WODs
          </button>
        </div>
        <div v-else class="today-wod">
          <div class="wod-header">
            <h3>{{ todayWod.name }}</h3>
            <span class="wod-mode">{{ todayWod.mode }}</span>
          </div>
          <div class="wod-description">
            {{ todayWod.description }}
          </div>
          <div class="wod-actions">
            <button @click="startWod(todayWod)" class="start-btn">
              ¡Empezar WOD!
            </button>
            <button @click="recordTodayWod = todayWod; showRecordModal = true" class="record-btn">
              Registrar Resultado
            </button>
          </div>
          
          <!-- Resultados de otros atletas para este WOD -->
          <div v-if="todayWodResults.length > 0" class="wod-leaderboard">
            <h4>Resultados de Hoy</h4>
            <div class="leaderboard-list">
              <div 
                v-for="(result, index) in todayWodResults" 
                :key="result.id"
                class="leaderboard-item"
              >
                <span class="position">{{ index + 1 }}</span>
                <span class="name">{{ getUserName(result.user_id) }}</span>
                <span class="result">{{ result.result }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progreso personal -->
      <div class="content-section">
        <div class="section-header">
          <h2>Mi Progreso</h2>
          <router-link to="/records" class="view-all-link">Ver todo</router-link>
        </div>
        
        <div v-if="loading.records" class="loading">Cargando progreso...</div>
        <div v-else-if="myRecords.length === 0" class="empty-state">
          <p>Aún no tienes records registrados</p>
          <button @click="showRecordModal = true" class="record-first-btn">
            Registrar primer record
          </button>
        </div>
        <div v-else class="progress-section">
          <!-- Últimos records -->
          <div class="recent-records">
            <h4>Últimos Records</h4>
            <div class="records-list">
              <div 
                v-for="record in recentRecords" 
                :key="record.id"
                class="record-item"
              >
                <div class="record-wod">{{ getWodName(record.wod_id) }}</div>
                <div class="record-result">{{ record.result }}</div>
                <div class="record-date">{{ formatDate(record.date) }}</div>
              </div>
            </div>
          </div>
          
          <!-- Mejores marcas -->
          <div class="personal-bests">
            <h4>Mejores Marcas por WOD</h4>
            <div class="bests-list">
              <div 
                v-for="best in personalBests" 
                :key="best.wod_id"
                class="best-item"
              >
                <div class="best-wod">{{ best.wod_name }}</div>
                <div class="best-result">{{ best.best_result }}</div>
                <div class="best-improvement" v-if="best.improvement">
                  <span class="improvement-icon">📈</span>
                  {{ best.improvement }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- WODs disponibles -->
      <div class="content-section">
        <div class="section-header">
          <h2>WODs Disponibles</h2>
          <router-link to="/wods" class="view-all-link">Ver todos</router-link>
        </div>
        
        <div v-if="loading.wods" class="loading">Cargando WODs...</div>
        <div v-else-if="availableWods.length === 0" class="empty-state">
          <p>No hay WODs disponibles</p>
        </div>
        <div v-else class="wods-grid">
          <div 
            v-for="wod in availableWods" 
            :key="wod.id"
            class="wod-card"
            @click="viewWodDetails(wod)"
          >
            <div class="wod-header">
              <h4>{{ wod.name }}</h4>
              <span class="wod-mode">{{ wod.mode }}</span>
            </div>
            <p class="wod-preview">{{ truncateText(wod.description, 60) }}</p>
            <div class="wod-meta">
              <span class="attempts">{{ getWodAttempts(wod.id) }} intentos</span>
              <span class="my-best" v-if="getMyBestForWod(wod.id)">
                Mi mejor: {{ getMyBestForWod(wod.id) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivación y objetivos -->
      <div class="content-section motivation">
        <div class="section-header">
          <h2>Motivación del Día</h2>
        </div>
        
        <div class="motivation-content">
          <div class="quote">
            <p>"{{ motivationalQuote.text }}"</p>
            <cite>- {{ motivationalQuote.author }}</cite>
          </div>
          
          <div class="daily-goal" v-if="dailyGoal">
            <h4>Objetivo de Hoy</h4>
            <p>{{ dailyGoal.text }}</p>
            <div class="goal-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: dailyGoal.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ dailyGoal.progress }}% completado</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para registrar record -->
    <div v-if="showRecordModal" class="modal-overlay" @click="closeRecordModal">
      <div class="modal-content" @click.stop>
        <h2>Registrar Nuevo Record</h2>
        <form @submit.prevent="submitRecord">
          <div class="form-group">
            <label for="recordWod">WOD:</label>
            <select id="recordWod" v-model="newRecord.wod_id" required>
              <option value="">Seleccionar WOD</option>
              <option 
                v-for="wod in availableWods" 
                :key="wod.id" 
                :value="wod.id"
                :selected="recordTodayWod && wod.id === recordTodayWod.id"
              >
                {{ wod.name }} - {{ wod.mode }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="recordResult">Tu Resultado:</label>
            <input 
              id="recordResult"
              v-model="newRecord.result" 
              type="text" 
              required 
              placeholder="Ej: 5:43, 25 reps, 135 lbs"
            />
          </div>
          
          <div class="form-group">
            <label for="recordNotes">Notas (opcional):</label>
            <textarea 
              id="recordNotes"
              v-model="newRecord.notes" 
              rows="3"
              placeholder="¿Cómo te sentiste? ¿Qué fue difícil? ¿Qué mejoraste?"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="recordDate">Fecha del entrenamiento:</label>
            <input 
              id="recordDate"
              v-model="newRecord.date" 
              type="date"
              :max="today"
              required
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="submittingRecord">
              {{ submittingRecord ? 'Guardando...' : 'Guardar Record' }}
            </button>
            <button type="button" @click="closeRecordModal" class="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore, useWodStore, useMemberStore, useRecordStore } from '../stores/main';
import apiService from '../services/api';

export default {
  name: 'AthleteDashboard',
  setup() {
    const authStore = useAuthStore();
    const wodStore = useWodStore();
    const memberStore = useMemberStore();
    const recordStore = useRecordStore();
    
    const loading = reactive({
      wods: false,
      records: false,
      todayWod: false
    });
    
    const showRecordModal = ref(false);
    const submittingRecord = ref(false);
    const recordTodayWod = ref(null);
    
    const today = new Date().toISOString().split('T')[0];
    
    const newRecord = reactive({
      wod_id: '',
      result: '',
      notes: '',
      date: today
    });
    
    const personalStats = reactive({
      totalRecords: 0,
      newRecordsThisWeek: 0,
      currentStreak: 0,
      streakStatus: '',
      favoriteWodType: '',
      favoriteWodCount: 0,
      ranking: 0,
      rankingTrend: ''
    });
    
    const motivationalQuote = ref({
      text: "El único mal entrenamiento es el que no hiciste",
      author: "Desconocido"
    });
    
    const dailyGoal = ref({
      text: "Completar el WOD del día con buena forma",
      progress: 0
    });
    
    const todayWod = ref(null);
    
    const myRecords = computed(() => 
      recordStore.records.filter(record => record.user_id === authStore.user?.id)
    );
    
    const recentRecords = computed(() => 
      myRecords.value
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
    );
    
    const availableWods = computed(() => 
      wodStore.wods.slice(0, 8)
    );
    
    const todayWodResults = computed(() => {
      if (!todayWod.value) return [];
      
      const today = new Date().toISOString().split('T')[0];
      return recordStore.records
        .filter(record => 
          record.wod_id === todayWod.value.id && 
          record.date === today
        )
        .sort((a, b) => {
          // Ordenar por tiempo (para WODs "For Time") o por reps/peso
          // Aquí se puede mejorar con lógica más específica
          return a.result.localeCompare(b.result);
        })
        .slice(0, 5);
    });
    
    const personalBests = computed(() => {
      const bests = {};
      
      myRecords.value.forEach(record => {
        const wodId = record.wod_id;
        if (!bests[wodId] || isBetterResult(record.result, bests[wodId].result)) {
          bests[wodId] = {
            wod_id: wodId,
            wod_name: getWodName(wodId),
            best_result: record.result,
            date: record.date
          };
        }
      });
      
      return Object.values(bests).slice(0, 5);
    });

    const loadDashboardData = async () => {
      try {
        await Promise.all([
          loadWods(),
          loadRecords(),
          loadMembers()
        ]);
        
        calculatePersonalStats();
        setTodayWod();
        loadMotivation();
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
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
        console.error('Error cargando WODs:', error);
      } finally {
        loading.wods = false;
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
        console.error('Error cargando records:', error);
      } finally {
        loading.records = false;
      }
    };

    const loadMembers = async () => {
      try {
        const response = await apiService.getMembers();
        if (response.data.status === 'OK') {
          memberStore.setMembers(response.data.data);
        }
      } catch (error) {
        console.error('Error cargando miembros:', error);
      }
    };

    const calculatePersonalStats = () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      personalStats.totalRecords = myRecords.value.length;
      personalStats.newRecordsThisWeek = myRecords.value.filter(record => 
        new Date(record.created_at) >= weekAgo
      ).length;
      
      // Calcular racha (simulado)
      personalStats.currentStreak = Math.floor(Math.random() * 10) + 1;
      personalStats.streakStatus = personalStats.currentStreak > 5 ? '🔥 ¡En racha!' : 'Sigue así';
      
      // WOD favorito (más frecuente)
      const wodCounts = {};
      myRecords.value.forEach(record => {
        wodCounts[record.wod_id] = (wodCounts[record.wod_id] || 0) + 1;
      });
      
      const mostFrequent = Object.entries(wodCounts)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (mostFrequent) {
        personalStats.favoriteWodType = getWodName(parseInt(mostFrequent[0]));
        personalStats.favoriteWodCount = mostFrequent[1];
      } else {
        personalStats.favoriteWodType = 'N/A';
        personalStats.favoriteWodCount = 0;
      }
      
      // Ranking simulado
      const totalAthletes = memberStore.members.filter(m => m.role === 'atleta').length;
      personalStats.ranking = Math.floor(Math.random() * totalAthletes) + 1;
      personalStats.rankingTrend = Math.random() > 0.5 ? '↗️ Subiendo' : '↘️ Mantente fuerte';
    };

    const setTodayWod = () => {
      // Seleccionar un WOD "del día" (aquí puedes implementar lógica más sofisticada)
      const wods = wodStore.wods;
      if (wods.length > 0) {
        const randomIndex = new Date().getDate() % wods.length;
        todayWod.value = wods[randomIndex];
      }
    };

    const loadMotivation = () => {
      const quotes = [
        { text: "El único mal entrenamiento es el que no hiciste", author: "Desconocido" },
        { text: "Forging Elite Fitness", author: "CrossFit" },
        { text: "Tu único rival eres tú mismo", author: "Motivación" },
        { text: "El dolor es temporal, el orgullo es para siempre", author: "Desconocido" },
        { text: "Entrena como si tu vida dependiera de ello", author: "CrossFit" }
      ];
      
      const today = new Date().getDate();
      motivationalQuote.value = quotes[today % quotes.length];
      
      // Progreso del objetivo diario (simulado)
      dailyGoal.value.progress = Math.floor(Math.random() * 100);
    };

    const submitRecord = async () => {
      submittingRecord.value = true;
      try {
        const recordData = {
          ...newRecord,
          user_id: authStore.user?.id
        };
        
        const response = await apiService.createRecord(recordData);
        if (response.data.status === 'OK') {
          await loadRecords();
          calculatePersonalStats();
          closeRecordModal();
        }
      } catch (error) {
        console.error('Error registrando record:', error);
        alert('Error al registrar el record');
      } finally {
        submittingRecord.value = false;
      }
    };

    const closeRecordModal = () => {
      showRecordModal.value = false;
      recordTodayWod.value = null;
      Object.keys(newRecord).forEach(key => {
        if (key === 'date') {
          newRecord[key] = today;
        } else {
          newRecord[key] = '';
        }
      });
    };

    const startWod = (wod) => {
      // Implementar cronómetro o lógica de WOD
      console.log('Iniciando WOD:', wod);
      alert(`¡Iniciando ${wod.name}! Dale con todo 💪`);
    };

    const viewWodDetails = (wod) => {
      // Navegar a detalles del WOD
      console.log('Ver detalles del WOD:', wod);
    };

    const getWodAttempts = (wodId) => {
      return recordStore.records.filter(record => record.wod_id === wodId).length;
    };

    const getMyBestForWod = (wodId) => {
      const myBest = myRecords.value
        .filter(record => record.wod_id === wodId)
        .sort((a, b) => isBetterResult(a.result, b.result) ? -1 : 1)[0];
      
      return myBest ? myBest.result : null;
    };

    const isBetterResult = (result1, result2) => {
      // Lógica simplificada - en una implementación real, esto dependería del tipo de WOD
      return result1.localeCompare(result2) < 0;
    };

    const getWodName = (wodId) => {
      const wod = wodStore.wods.find(w => w.id === wodId);
      return wod ? wod.name : 'WOD desconocido';
    };

    const getUserName = (userId) => {
      const user = memberStore.members.find(m => m.id === userId);
      return user ? user.name : 'Usuario desconocido';
    };

    const truncateText = (text, length) => {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-ES');
    };

    onMounted(() => {
      loadDashboardData();
    });

    return {
      authStore,
      loading,
      showRecordModal,
      submittingRecord,
      recordTodayWod,
      today,
      newRecord,
      personalStats,
      motivationalQuote,
      dailyGoal,
      todayWod,
      myRecords,
      recentRecords,
      availableWods,
      todayWodResults,
      personalBests,
      submitRecord,
      closeRecordModal,
      startWod,
      viewWodDetails,
      getWodAttempts,
      getMyBestForWod,
      getWodName,
      getUserName,
      truncateText,
      formatDate
    };
  }
};
</script>

<style scoped>
.athlete-dashboard {
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  color: #f5576c;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.content-section.featured {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.content-section.motivation {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.featured .section-header {
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.featured .section-header h2 {
  color: white;
}

.date {
  font-size: 0.9rem;
  opacity: 0.8;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.featured .view-all-link {
  color: rgba(255, 255, 255, 0.9);
}

.view-all-link:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.featured .loading {
  color: rgba(255, 255, 255, 0.8);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.featured .empty-state {
  color: rgba(255, 255, 255, 0.8);
}

.explore-btn, .record-first-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.record-first-btn {
  background: #667eea;
  color: white;
  border: none;
}

.today-wod {
  color: white;
}

.wod-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.wod-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.wod-mode {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.wod-description {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  white-space: pre-line;
  font-family: 'Courier New', monospace;
}

.wod-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.start-btn, .record-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.start-btn {
  background: #28a745;
  color: white;
  font-size: 1.1rem;
}

.record-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.start-btn:hover, .record-btn:hover {
  transform: translateY(-1px);
}

.wod-leaderboard {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
}

.wod-leaderboard h4 {
  margin: 0 0 1rem 0;
  color: white;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.position {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.name {
  flex: 1;
  margin-left: 1rem;
}

.result {
  font-weight: bold;
}

.progress-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.recent-records, .personal-bests {
  margin-bottom: 2rem;
}

.records-list, .bests-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-item, .best-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.record-wod, .best-wod {
  font-weight: 500;
  color: #2c3e50;
}

.record-result, .best-result {
  font-weight: bold;
  color: #28a745;
}

.record-date {
  font-size: 0.8rem;
  color: #6c757d;
}

.best-improvement {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #28a745;
}

.improvement-icon {
  font-size: 1rem;
}

.wods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.wod-card {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.wod-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.wod-card .wod-header {
  margin-bottom: 0.75rem;
}

.wod-card .wod-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

.wod-card .wod-mode {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
}

.wod-preview {
  color: #6c757d;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.3;
}

.wod-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
}

.my-best {
  color: #28a745;
  font-weight: 500;
}

.motivation-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.quote {
  text-align: center;
}

.quote p {
  font-size: 1.2rem;
  font-style: italic;
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.quote cite {
  color: #6c757d;
  font-size: 0.9rem;
}

.daily-goal h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.progress-text {
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
  border-color: #f5576c;
  box-shadow: 0 0 0 2px rgba(245, 87, 108, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn {
  background: #f5576c;
  color: white;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .motivation-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .athlete-dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .wods-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    justify-content: center;
  }

  .wod-actions {
    flex-direction: column;
  }
}
</style>
