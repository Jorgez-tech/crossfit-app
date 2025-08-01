<template>
  <div class="crossfit-wods">
    <h2 style="color: red;">✅ Componente CrossfitWods cargado</h2>
    <header class="wods-header">
      <h2>🏋️ CrossFit WODs</h2>
      <button @click="fetchWods" class="refresh-btn" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </header>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando entrenamientos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <p>❌ Error al cargar los WODs: {{ error }}</p>
      <button @click="fetchWods" class="retry-btn">Reintentar</button>
    </div>

    <!-- WODs List -->
    <div v-else-if="wods.length > 0" class="wods-grid">
      <div v-for="wod in wods" :key="wod.id" class="wod-card">
        <div class="wod-header">
          <h3>{{ wod.name }}</h3>
          <span class="wod-mode">{{ wod.mode }}</span>
        </div>
        <div class="wod-content">
          <p class="wod-equipment">
            <strong>Equipamiento:</strong> 
            {{ wod.equipment?.join(', ') || 'Sin equipamiento' }}
          </p>
          <div class="wod-exercises">
            <h4>Ejercicios:</h4>
            <ul>
              <li v-for="exercise in wod.exercises" :key="exercise">
                {{ exercise }}
              </li>
            </ul>
          </div>
          <div class="wod-trainer" v-if="wod.trainerTips">
            <h4>💡 Consejos del entrenador:</h4>
            <p>{{ wod.trainerTips }}</p>
          </div>
        </div>
        <div class="wod-actions">
          <button @click="selectWod(wod)" class="select-btn">
            Seleccionar WOD
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <h3>No hay WODs disponibles</h3>
      <p>Conecta con tu API de CrossFit para ver los entrenamientos</p>
    </div>

    <!-- Selected WOD Modal -->
    <div v-if="selectedWod" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🎯 {{ selectedWod.name }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p><strong>Modo:</strong> {{ selectedWod.mode }}</p>
          <p><strong>Equipamiento:</strong> {{ selectedWod.equipment?.join(', ') || 'Sin equipamiento' }}</p>
          <div class="exercises-detail">
            <h4>Plan de entrenamiento:</h4>
            <ul>
              <li v-for="exercise in selectedWod.exercises" :key="exercise">
                {{ exercise }}
              </li>
            </ul>
          </div>
          <div v-if="selectedWod.trainerTips" class="trainer-tips">
            <h4>💡 Consejos:</h4>
            <p>{{ selectedWod.trainerTips }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="startWorkout" class="start-workout-btn">
            🚀 Iniciar Entrenamiento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../services/api.js';

export default {
  name: 'CrossfitWods',
  data() {
    return {
      wods: [],
      loading: false,
      error: null,
      selectedWod: null
    };
  },
  methods: {
    async fetchWods() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiService.getWods();
        console.log('Respuesta completa de la API:', response);
        console.log('Datos recibidos:', response.data);
        console.log('Array de WODs:', response.data.data);
        
        // La API devuelve: { status: 'OK', data: [array de WODs] }
        // Necesitamos acceder a response.data.data para obtener el array
        this.wods = response.data.data || [];
        console.log('WODs asignados (corregido):', this.wods);
      } catch (error) {
        this.error = error.response?.data?.message || 'Error de conexión con la API';
        console.error('Error fetching WODs:', error);
      } finally {
        this.loading = false;
      }
    },
    selectWod(wod) {
      this.selectedWod = wod;
    },
    closeModal() {
      this.selectedWod = null;
    },
    startWorkout() {
      alert(`¡Iniciando entrenamiento: ${this.selectedWod.name}! 💪`);
      this.closeModal();
      // Aquí puedes agregar lógica para temporizador, registro de progreso, etc.
    }
  },
  mounted() {
    this.fetchWods();
  }
};
</script>

<style scoped>
.crossfit-wods {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.wods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid #e74c3c;
}

.wods-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.refresh-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 50px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 30px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 10px;
  margin: 20px 0;
}

.retry-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.wods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.wod-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.wod-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.wod-header {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wod-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.wod-mode {
  background: rgba(255,255,255,0.2);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.wod-content {
  padding: 20px;
}

.wod-equipment {
  color: #7f8c8d;
  margin-bottom: 15px;
}

.wod-exercises h4,
.wod-trainer h4 {
  color: #2c3e50;
  margin-bottom: 10px;
  margin-top: 15px;
}

.wod-exercises ul {
  list-style: none;
  padding: 0;
}

.wod-exercises li {
  background: #f8f9fa;
  padding: 8px 12px;
  margin: 5px 0;
  border-radius: 5px;
  border-left: 4px solid #e74c3c;
}

.wod-trainer {
  background: #e8f5e8;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  border-left: 4px solid #27ae60;
}

.wod-actions {
  padding: 0 20px 20px;
}

.select-btn {
  width: 100%;
  background: linear-gradient(135deg, #27ae60, #229954);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.select-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.empty-state h3 {
  color: #95a5a6;
  margin-bottom: 10px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.modal-header {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 30px;
}

.exercises-detail ul {
  list-style: none;
  padding: 0;
}

.exercises-detail li {
  background: #f8f9fa;
  padding: 10px 15px;
  margin: 8px 0;
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
}

.trainer-tips {
  background: #e8f5e8;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  border-left: 4px solid #27ae60;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #eee;
  text-align: center;
}

.start-workout-btn {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.start-workout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(243, 156, 18, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .wods-grid {
    grid-template-columns: 1fr;
  }
  
  .wods-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>
