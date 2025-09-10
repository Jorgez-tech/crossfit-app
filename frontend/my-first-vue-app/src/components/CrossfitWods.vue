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
        <header class="wod-header">
          <h3>{{ wod.name }}</h3>
          <span class="wod-mode" :aria-label="`Modalidad: ${wod.mode}`">{{ wod.mode }}</span>
        </header>
        <div class="wod-content">
          <p class="wod-equipment">
            <strong>Equipamiento:</strong> 
            {{ wod.equipment?.join(', ') || 'Sin equipamiento' }}
          </p>
          <div class="wod-exercises">
            <h4>Ejercicios:</h4>
            <ul role="list">
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
        <footer class="wod-actions">
          <button @click="selectWod(wod)" class="select-btn" :aria-label="`Seleccionar entrenamiento ${wod.name}`">
            Seleccionar WOD
          </button>
        </footer>
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
          <p><strong>Modo:</strong> {{ selectedWod.mode }}</p>
          <p><strong>Equipamiento:</strong> {{ selectedWod.equipment?.join(', ') || 'Sin equipamiento' }}</p>
          <div class="exercises-detail">
            <h4>Plan de entrenamiento:</h4>
            <ul role="list">
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

/* Accessibility support */
@media (prefers-reduced-motion: reduce) {
  .refresh-btn:hover:not(:disabled),
  .retry-btn:hover {
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
}
</style>