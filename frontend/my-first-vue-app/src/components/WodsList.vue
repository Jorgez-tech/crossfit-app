<template>
  <div class="wods-container">
    <div class="wods-header">
      <h2>Entrenamientos (WODs)</h2>
      <button 
        v-if="authStore.isTrainer" 
        @click="showCreateForm = true"
        class="add-btn"
      >
        + Nuevo WOD
      </button>
    </div>

    <!-- Formulario para crear nuevo WOD -->
    <div v-if="showCreateForm" class="create-form">
      <h3>Crear Nuevo WOD</h3>
      <form @submit.prevent="createWod">
        <div class="form-group">
          <label for="wodName">Nombre del WOD:</label>
          <input 
            id="wodName"
            v-model="newWod.name" 
            type="text" 
            required 
            placeholder="Ej: Fran, Murph, etc."
          />
        </div>
        
        <div class="form-group">
          <label for="wodMode">Modalidad:</label>
          <input 
            id="wodMode"
            v-model="newWod.mode" 
            type="text" 
            required 
            placeholder="Ej: For Time, AMRAP, etc."
          />
        </div>
        
        <div class="form-group">
          <label for="wodEquipment">Equipamiento (separado por comas):</label>
          <input 
            id="wodEquipment"
            v-model="equipmentString" 
            type="text" 
            placeholder="Ej: barbell, pull-up bar, kettlebell"
          />
        </div>
        
        <div class="form-group">
          <label for="wodExercises">Ejercicios (uno por línea):</label>
          <textarea 
            id="wodExercises"
            v-model="exercisesString" 
            rows="4" 
            required
            placeholder="21 thrusters (95/65 lb)&#10;21 pull-ups&#10;15 thrusters (95/65 lb)&#10;15 pull-ups"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="wodTips">Consejos del entrenador (uno por línea):</label>
          <textarea 
            id="wodTips"
            v-model="tipsString" 
            rows="3"
            placeholder="Scale the weight to complete thrusters in 1-2 sets&#10;Break up pull-ups early to maintain speed"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Creando...' : 'Crear WOD' }}
          </button>
          <button type="button" @click="cancelCreate" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de WODs -->
    <div v-if="loading && wods.length === 0" class="loading">
      Cargando WODs...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="wods.length === 0" class="no-wods">
      No hay WODs disponibles.
      <span v-if="authStore.isTrainer">¡Crea el primero!</span>
    </div>
    
    <div v-else class="wods-grid">
      <div 
        v-for="wod in wods" 
        :key="wod.id" 
        class="wod-card"
        @click="selectWod(wod)"
      >
        <h3>{{ wod.name }}</h3>
        <p class="wod-mode">{{ wod.mode }}</p>
        
        <div class="wod-equipment" v-if="wod.equipment && wod.equipment.length">
          <strong>Equipamiento:</strong>
          <span class="equipment-tags">
            <span v-for="equipment in wod.equipment" :key="equipment" class="equipment-tag">
              {{ equipment }}
            </span>
          </span>
        </div>
        
        <div class="wod-exercises">
          <strong>Ejercicios:</strong>
          <ul>
            <li v-for="(exercise, index) in wod.exercises.slice(0, 3)" :key="index">
              {{ exercise }}
            </li>
            <li v-if="wod.exercises.length > 3" class="more-exercises">
              +{{ wod.exercises.length - 3 }} más...
            </li>
          </ul>
        </div>
        
        <div class="wod-date">
          <small>Creado: {{ formatDate(wod.created_at) }}</small>
        </div>
        
        <div v-if="authStore.isTrainer" class="wod-actions">
          <button @click.stop="editWod(wod)" class="edit-btn">Editar</button>
          <button @click.stop="deleteWod(wod.id)" class="delete-btn">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal para ver detalles del WOD -->
    <div v-if="selectedWod" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ selectedWod.name }}</h2>
        <p><strong>Modalidad:</strong> {{ selectedWod.mode }}</p>
        
        <div v-if="selectedWod.equipment && selectedWod.equipment.length">
          <strong>Equipamiento:</strong>
          <ul>
            <li v-for="equipment in selectedWod.equipment" :key="equipment">
              {{ equipment }}
            </li>
          </ul>
        </div>
        
        <div>
          <strong>Ejercicios:</strong>
          <ol>
            <li v-for="(exercise, index) in selectedWod.exercises" :key="index">
              {{ exercise }}
            </li>
          </ol>
        </div>
        
        <div v-if="selectedWod.trainerTips && selectedWod.trainerTips.length">
          <strong>Consejos del entrenador:</strong>
          <ul>
            <li v-for="(tip, index) in selectedWod.trainerTips" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>
        
        <button @click="closeModal" class="close-btn">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore, useWodStore } from '../stores/main';
import apiService from '../services/api';
import logger from '../utils/logger';

export default {
  name: 'WodsList',
  setup() {
    const authStore = useAuthStore();
    const wodStore = useWodStore();
    const log = logger.scoped('WodsList');
    
    const loading = ref(false);
    const error = ref('');
    const showCreateForm = ref(false);
    const selectedWod = ref(null);
    
    const newWod = reactive({
      name: '',
      mode: '',
      equipment: [],
      exercises: [],
      trainerTips: []
    });
    
    const equipmentString = ref('');
    const exercisesString = ref('');
    const tipsString = ref('');
    
    const wods = computed(() => wodStore.wods);

    const loadWods = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await apiService.getWods();
        if (response.data.status === 'OK') {
          wodStore.setWods(response.data.data);
        }
      } catch (err) {
        log.error('Error cargando WODs', err);
        error.value = 'Error al cargar los WODs';
      } finally {
        loading.value = false;
      }
    };

    const createWod = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        // Preparar datos del WOD
        const wodData = {
          name: newWod.name,
          mode: newWod.mode,
          equipment: equipmentString.value ? equipmentString.value.split(',').map(item => item.trim()) : [],
          exercises: exercisesString.value.split('\n').filter(line => line.trim()),
          trainerTips: tipsString.value ? tipsString.value.split('\n').filter(line => line.trim()) : []
        };
        
        const response = await apiService.createWod(wodData);
        if (response.data.status === 'OK') {
          // Recargar lista de WODs
          await loadWods();
          cancelCreate();
        }
      } catch (err) {
        log.error('Error creando WOD', err);
        error.value = 'Error al crear el WOD';
      } finally {
        loading.value = false;
      }
    };

    const cancelCreate = () => {
      showCreateForm.value = false;
      // Limpiar formulario
      newWod.name = '';
      newWod.mode = '';
      equipmentString.value = '';
      exercisesString.value = '';
      tipsString.value = '';
      error.value = '';
    };

    const selectWod = (wod) => {
      selectedWod.value = wod;
    };

    const closeModal = () => {
      selectedWod.value = null;
    };

    const editWod = (wod) => {
      log.debug('Editar WOD solicitado', { id: wod.id });
      // TODO: Implementar edición
    };

    const deleteWod = async (wodId) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este WOD?')) {
        return;
      }
      
      try {
        await apiService.deleteWod(wodId);
        await loadWods(); // Recargar lista
      } catch (err) {
        log.error('Error eliminando WOD', err);
        error.value = 'Error al eliminar el WOD';
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };

    onMounted(() => {
      loadWods();
    });

    return {
      authStore,
      wods,
      loading,
      error,
      showCreateForm,
      selectedWod,
      newWod,
      equipmentString,
      exercisesString,
      tipsString,
      loadWods,
      createWod,
      cancelCreate,
      selectWod,
      closeModal,
      editWod,
      deleteWod,
      formatDate
    };
  }
};
</script>

<style scoped>
.wods-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.wods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.wods-header h2 {
  margin: 0;
  color: #2c3e50;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.add-btn:hover {
  background-color: #45a049;
}

.create-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.create-form h3 {
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
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.no-wods {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.1rem;
}

.wods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.wod-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.wod-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.wod-card h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.wod-mode {
  color: #4CAF50;
  font-weight: 500;
  margin: 0 0 1rem 0;
}

.wod-equipment {
  margin-bottom: 1rem;
}

.equipment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.equipment-tag {
  background-color: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.wod-exercises {
  margin-bottom: 1rem;
}

.wod-exercises ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.wod-exercises li {
  margin-bottom: 0.25rem;
}

.more-exercises {
  color: #6c757d;
  font-style: italic;
}

.wod-date {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.wod-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 1rem;
}

.modal-content h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.modal-content ul, .modal-content ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.close-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1.5rem;
}

.close-btn:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .wods-container {
    padding: 1rem;
  }

  .wods-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .wods-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .modal-content {
    margin: 0.5rem;
    padding: 1.5rem;
  }
}
</style>
