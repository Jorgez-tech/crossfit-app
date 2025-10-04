<template>
  <div class="crossfit-wods">
    <header class="wods-header">
      <h2>🏋️ CrossFit WODs</h2>
      <button @click="fetchWods" class="refresh-btn" :disabled="loading" :aria-label="loading ? 'Cargando entrenamientos' : 'Actualizar lista de entrenamientos'">
        {{ loading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </header>

    <!-- Loading state -->
    <div v-if="loading" class="loading" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p>Cargando entrenamientos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error" role="alert" aria-live="assertive">
      <p>❌ Error al cargar los WODs: {{ error }}</p>
      <button @click="fetchWods" class="retry-btn" aria-label="Reintentar carga de entrenamientos">Reintentar</button>
    </div>

    <!-- WODs List -->
    <div v-else-if="wods.length > 0" class="wods-grid" role="grid" aria-label="Lista de entrenamientos disponibles">
      <article v-for="wod in wods" :key="wod.id" class="wod-card" role="gridcell">
        <div class="wod-card-header">
          <div class="wod-title-section">
            <h3 class="wod-name">{{ wod.name }}</h3>
            <span class="wod-type-badge" v-if="getWodType(wod.description)">
              {{ getWodType(wod.description) }}
            </span>
          </div>
          <div class="wod-meta">
            <span class="wod-date" v-if="wod.created_at">
              📅 {{ formatDate(wod.created_at) }}
            </span>
          </div>
        </div>
        
        <div class="wod-card-body">
          <div class="wod-description" v-if="wod.description">
            <p class="description-text">{{ wod.description }}</p>
          </div>
          
          <div class="wod-exercises-section">
            <h4 class="exercises-title">🏋️ Ejercicios</h4>
            <div class="exercises-content">
              {{ formatExercises(wod.exercises) }}
            </div>
          </div>
        </div>
        
        <div class="wod-card-footer">
          <button @click="selectWod(wod)" class="wod-action-btn" :aria-label="`Ver detalles de ${wod.name}`">
            <span class="btn-icon">👁️</span>
            <span class="btn-text">Ver Detalles</span>
          </button>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state" role="status">
      <h3>No hay WODs disponibles</h3>
      <p>Conecta con tu API de CrossFit para ver los entrenamientos</p>
    </div>

    <!-- Selected WOD Modal -->
    <div v-if="selectedWod" class="modal-overlay" @click="closeModal" role="dialog" aria-modal="true" :aria-label="`Detalles del entrenamiento ${selectedWod.name}`">
      <div class="modal-content" @click.stop>
        <header class="modal-header">
          <h3 id="modal-title">🎯 {{ selectedWod.name }}</h3>
          <button @click="closeModal" class="close-btn" aria-label="Cerrar ventana de detalles">&times;</button>
        </header>
        <div class="modal-body" role="document">
          <p v-if="selectedWod.description"><strong>Descripción:</strong> {{ selectedWod.description }}</p>
          <div class="exercises-detail">
            <h4>Plan de entrenamiento:</h4>
            <p>{{ formatExercises(selectedWod.exercises) }}</p>
          </div>
        </div>
        <footer class="modal-footer">
          <button @click="startWorkout" class="start-workout-btn" :aria-label="`Iniciar entrenamiento ${selectedWod.name}`">
            🚀 Iniciar Entrenamiento
          </button>
        </footer>
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
    formatDate(dateString) {
      if (!dateString) return 'Sin fecha';
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    },
    getWodType(description) {
      if (!description) return null;
      const descLower = description.toLowerCase();
      if (descLower.includes('amrap')) return 'AMRAP';
      if (descLower.includes('for time') || descLower.includes('por tiempo')) return 'For Time';
      if (descLower.includes('emom')) return 'EMOM';
      if (descLower.includes('tabata')) return 'Tabata';
      if (descLower.includes('rondas')) return 'Rondas';
      return null;
    },
    formatExercises(exercises) {
      if (!exercises) return 'No especificado';
      if (typeof exercises === 'string') return exercises;
      if (Array.isArray(exercises)) return exercises.join(', ');
      return JSON.stringify(exercises);
    },
    selectWod(wod) {
      this.selectedWod = wod;
      this.$nextTick(() => {
        // Focus management for accessibility
        const modal = document.querySelector('.modal-content');
        if (modal) {
          modal.focus();
        }
      });
    },
    closeModal() {
      this.selectedWod = null;
    },
    startWorkout() {
      alert(`¡Iniciando entrenamiento: ${this.selectedWod.name}! 💪`);
      this.closeModal();
      // Aquí puedes agregar lógica para temporizador, registro de progreso, etc.
    },
    handleKeydown(event) {
      // ESC key to close modal
      if (event.key === 'Escape' && this.selectedWod) {
        this.closeModal();
      }
    }
  },
  mounted() {
    this.fetchWods();
    // Add keyboard event listener for accessibility
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped>
.crossfit-wods {
  padding: var(--spacing-xl, 32px) var(--spacing-lg, 24px);
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.wods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl, 32px);
  padding-bottom: var(--spacing-md, 16px);
  border-bottom: 3px solid var(--color-accent, #e74c3c);
  flex-wrap: wrap;
  gap: var(--spacing-md, 16px);
}

.wods-header h2 {
  color: var(--color-text, #2c3e50);
  font-size: var(--font-size-2xl, 24px);
  margin: 0;
  font-weight: 600;
}

.refresh-btn {
  background: linear-gradient(135deg, var(--color-accent, #e74c3c), var(--color-accent-dark, #c0392b));
  color: var(--color-white, #ffffff);
  border: none;
  min-height: var(--touch-target-min, 44px);
  min-width: var(--touch-target-min, 44px);
  padding: var(--spacing-sm, 12px) var(--spacing-lg, 24px);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: var(--font-size-base, 16px);
  transition: var(--transition-base, all 0.3s ease);
  border: 2px solid transparent;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
}

.refresh-btn:focus {
  outline: none;
  border-color: var(--color-white, #ffffff);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading {
  text-align: center;
  padding: var(--spacing-2xl, 48px);
  font-size: var(--font-size-base, 16px);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--color-accent, #e74c3c);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg, 24px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: var(--spacing-xl, 32px);
  background: rgba(254, 238, 238, 0.95);
  border: 2px solid #fcc;
  border-radius: 12px;
  margin: var(--spacing-lg, 24px) 0;
  font-size: var(--font-size-base, 16px);
  backdrop-filter: blur(5px);
}

.retry-btn {
  background: var(--color-accent, #e74c3c);
  color: var(--color-white, #ffffff);
  border: none;
  min-height: var(--touch-target-min, 44px);
  min-width: var(--touch-target-min, 44px);
  padding: var(--spacing-sm, 12px) var(--spacing-lg, 24px);
  border-radius: 8px;
  cursor: pointer;
  margin-top: var(--spacing-md, 16px);
  font-size: var(--font-size-base, 16px);
  font-weight: 600;
  transition: var(--transition-base, all 0.3s ease);
  border: 2px solid transparent;
}

.retry-btn:hover {
  background: var(--color-accent-dark, #c0392b);
  transform: translateY(-1px);
}

.retry-btn:focus {
  outline: none;
  border-color: var(--color-accent, #e74c3c);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl, 48px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  border: 2px dashed #ddd;
  margin: var(--spacing-lg, 24px) 0;
}

.empty-state h3 {
  color: var(--color-text, #2c3e50);
  margin-bottom: var(--spacing-md, 16px);
  font-size: var(--font-size-xl, 20px);
}

.empty-state p {
  color: var(--color-text-light, #6c757d);
  font-size: var(--font-size-base, 16px);
}

/* WODs Grid Layout */
.wods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl, 32px);
  margin-top: var(--spacing-xl, 32px);
}

/* WOD Card Styles */
.wod-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.wod-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-accent, #e74c3c);
}

/* Card Header */
.wod-card-header {
  background: linear-gradient(135deg, var(--color-accent, #e74c3c), var(--color-accent-dark, #c0392b));
  padding: var(--spacing-lg, 24px);
  color: white;
}

.wod-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm, 12px);
  margin-bottom: var(--spacing-sm, 12px);
}

.wod-name {
  font-size: var(--font-size-xl, 20px);
  font-weight: 700;
  margin: 0;
  color: white;
  line-height: 1.3;
  flex: 1;
}

.wod-type-badge {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  padding: var(--spacing-xs, 8px) var(--spacing-sm, 12px);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.wod-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 16px);
  font-size: 14px;
  opacity: 0.95;
}

.wod-date {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs, 8px);
}

/* Card Body */
.wod-card-body {
  padding: var(--spacing-lg, 24px);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
}

.wod-description {
  padding-bottom: var(--spacing-md, 16px);
  border-bottom: 2px solid rgba(231, 76, 60, 0.1);
}

.description-text {
  margin: 0;
  color: var(--color-text, #2c3e50);
  font-size: var(--font-size-base, 16px);
  font-weight: 600;
  line-height: 1.5;
}

.wod-exercises-section {
  flex: 1;
}

.exercises-title {
  font-size: var(--font-size-base, 16px);
  font-weight: 600;
  color: var(--color-text, #2c3e50);
  margin: 0 0 var(--spacing-sm, 12px) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs, 8px);
}

.exercises-content {
  background: rgba(39, 174, 96, 0.05);
  padding: var(--spacing-md, 16px);
  border-radius: 8px;
  border-left: 4px solid var(--color-success, #27ae60);
  color: var(--color-text, #2c3e50);
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
}

/* Card Footer */
.wod-card-footer {
  padding: var(--spacing-md, 16px) var(--spacing-lg, 24px);
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.wod-action-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--color-success, #27ae60), var(--color-success-light, #42b983));
  color: white;
  border: none;
  padding: var(--spacing-sm, 12px) var(--spacing-lg, 24px);
  border-radius: 8px;
  font-size: var(--font-size-base, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm, 12px);
  min-height: var(--touch-target-min, 44px);
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.2);
}

.wod-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(39, 174, 96, 0.3);
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.wod-action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.3), 0 6px 16px rgba(39, 174, 96, 0.3);
}

.wod-action-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg, 24px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, var(--color-accent, #e74c3c), var(--color-accent-dark, #c0392b));
  color: white;
  padding: var(--spacing-lg, 24px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl, 20px);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: var(--spacing-lg, 24px);
}

.modal-body p {
  margin-bottom: var(--spacing-md, 16px);
}

.exercises-detail h4 {
  color: var(--color-text, #2c3e50);
  margin-bottom: var(--spacing-sm, 12px);
}

.modal-footer {
  padding: var(--spacing-lg, 24px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.start-workout-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--color-success, #27ae60), var(--color-success-light, #42b983));
  color: white;
  border: none;
  padding: var(--spacing-md, 16px) var(--spacing-lg, 24px);
  border-radius: 8px;
  font-size: var(--font-size-base, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: var(--touch-target-min, 44px);
}

.start-workout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(39, 174, 96, 0.3);
}

/* Accessibility support */
@media (prefers-reduced-motion: reduce) {
  .refresh-btn:hover:not(:disabled),
  .retry-btn:hover,
  .wod-card:hover,
  .wod-action-btn:hover,
  .wod-action-btn:active,
  .start-workout-btn:hover {
    transform: none;
  }
  
  .spinner {
    animation: none;
  }
}

@media (prefers-contrast: high) {
  .crossfit-wods {
    border: 2px solid #000000;
    background: #ffffff;
  }
  
  .error {
    background: #ffffff;
    border: 2px solid #000000;
  }
}

@media (max-width: 768px) {
  .crossfit-wods {
    padding: var(--spacing-lg, 24px) var(--spacing-md, 16px);
    margin: var(--spacing-md, 16px);
  }
  
  .wods-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md, 16px);
  }
  
  .wods-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg, 24px);
  }
  
  .wod-title-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .wod-type-badge {
    align-self: flex-start;
  }
}
</style>
