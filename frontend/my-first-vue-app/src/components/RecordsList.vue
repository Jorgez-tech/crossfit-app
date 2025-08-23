<template>
  <div class="records-container">
    <div class="records-header">
      <h2>Records de Entrenamientos</h2>
      <button 
        @click="showCreateForm = true"
        class="add-btn"
      >
        + Nuevo Record
      </button>
    </div>

    <!-- Formulario para crear nuevo record -->
    <div v-if="showCreateForm" class="create-form">
      <h3>Registrar Nuevo Record</h3>
      <form @submit.prevent="createRecord">
        <div class="form-row">
          <div class="form-group">
            <label for="recordWod">WOD:</label>
            <select id="recordWod" v-model="newRecord.wod_id" required>
              <option value="">Seleccionar WOD</option>
              <option 
                v-for="wod in availableWods" 
                :key="wod.id" 
                :value="wod.id"
              >
                {{ wod.name }} - {{ wod.mode }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="recordResult">Resultado:</label>
            <input 
              id="recordResult"
              v-model="newRecord.result" 
              type="text" 
              required 
              placeholder="Ej: 5:43, 25 reps, 135 lbs"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="recordNotes">Notas (opcional):</label>
          <textarea 
            id="recordNotes"
            v-model="newRecord.notes" 
            rows="3"
            placeholder="Comentarios adicionales sobre el entrenamiento..."
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
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar Record' }}
          </button>
          <button type="button" @click="cancelCreate" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <div class="filter-group">
        <label for="wodFilter">Filtrar por WOD:</label>
        <select id="wodFilter" v-model="wodFilter">
          <option value="">Todos los WODs</option>
          <option 
            v-for="wod in availableWods" 
            :key="wod.id" 
            :value="wod.id"
          >
            {{ wod.name }}
          </option>
        </select>
      </div>
      
      <div class="filter-group" v-if="authStore.isTrainer">
        <label for="userFilter">Filtrar por usuario:</label>
        <select id="userFilter" v-model="userFilter">
          <option value="">Todos los usuarios</option>
          <option 
            v-for="user in availableUsers" 
            :key="user.id" 
            :value="user.id"
          >
            {{ user.name }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="dateFilter">Filtrar por fecha:</label>
        <select id="dateFilter" v-model="dateFilter">
          <option value="">Todas las fechas</option>
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="year">Este año</option>
        </select>
      </div>
    </div>

    <!-- Lista de records -->
    <div v-if="loading && records.length === 0" class="loading">
      Cargando records...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="filteredRecords.length === 0" class="no-records">
      {{ hasFilters ? 'No se encontraron records con los filtros aplicados.' : 'No hay records registrados.' }}
      <br>
      <span v-if="!hasFilters">¡Registra tu primer record!</span>
    </div>
    
    <div v-else class="records-grid">
      <div 
        v-for="record in filteredRecords" 
        :key="record.id" 
        class="record-card"
      >
        <div class="record-header">
          <h3>{{ getWodName(record.wod_id) }}</h3>
          <span class="record-date">{{ formatDate(record.date) }}</span>
        </div>
        
        <div class="record-result">
          <span class="result-label">Resultado:</span>
          <span class="result-value">{{ record.result }}</span>
        </div>
        
        <div v-if="record.notes" class="record-notes">
          <strong>Notas:</strong> {{ record.notes }}
        </div>
        
        <div class="record-user" v-if="authStore.isTrainer">
          <strong>Atleta:</strong> {{ getUserName(record.user_id) }}
        </div>
        
        <div class="record-meta">
          <small>Registrado: {{ formatDateTime(record.created_at) }}</small>
        </div>
        
        <div class="record-actions" v-if="canEditRecord(record)">
          <button @click="editRecord(record)" class="edit-btn">
            Editar
          </button>
          <button @click="deleteRecord(record.id)" class="delete-btn">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para editar record -->
    <div v-if="editingRecord" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>Editar Record</h2>
        <form @submit.prevent="updateRecord">
          <div class="form-group">
            <label for="editResult">Resultado:</label>
            <input 
              id="editResult"
              v-model="editingRecord.result" 
              type="text" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="editNotes">Notas:</label>
            <textarea 
              id="editNotes"
              v-model="editingRecord.notes" 
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="editDate">Fecha:</label>
            <input 
              id="editDate"
              v-model="editingRecord.date" 
              type="date"
              :max="today"
              required
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? 'Actualizando...' : 'Actualizar' }}
            </button>
            <button type="button" @click="closeEditModal" class="cancel-btn">
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
import { useAuthStore, useRecordStore } from '../stores/main';
import apiService from '../services/api';

export default {
  name: 'RecordsList',
  setup() {
    const authStore = useAuthStore();
    const recordStore = useRecordStore();
    
    const loading = ref(false);
    const error = ref('');
    const showCreateForm = ref(false);
    const editingRecord = ref(null);
    const wodFilter = ref('');
    const userFilter = ref('');
    const dateFilter = ref('');
    
    const availableWods = ref([]);
    const availableUsers = ref([]);
    
    const today = new Date().toISOString().split('T')[0];
    
    const newRecord = reactive({
      wod_id: '',
      result: '',
      notes: '',
      date: today
    });
    
    const records = computed(() => recordStore.records);
    
    const hasFilters = computed(() => 
      wodFilter.value || userFilter.value || dateFilter.value
    );
    
    const filteredRecords = computed(() => {
      let filtered = records.value;
      
      // Filtrar por usuario si no es entrenador (solo sus propios records)
      if (!authStore.isTrainer) {
        filtered = filtered.filter(record => record.user_id === authStore.user?.id);
      }
      
      // Filtrar por WOD
      if (wodFilter.value) {
        filtered = filtered.filter(record => record.wod_id === parseInt(wodFilter.value));
      }
      
      // Filtrar por usuario (solo para entrenadores)
      if (userFilter.value && authStore.isTrainer) {
        filtered = filtered.filter(record => record.user_id === parseInt(userFilter.value));
      }
      
      // Filtrar por fecha
      if (dateFilter.value) {
        const now = new Date();
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          
          switch (dateFilter.value) {
            case 'today':
              return recordDate.toDateString() === now.toDateString();
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return recordDate >= weekAgo;
            case 'month':
              return recordDate.getMonth() === now.getMonth() && 
                     recordDate.getFullYear() === now.getFullYear();
            case 'year':
              return recordDate.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        });
      }
      
      // Ordenar por fecha (más recientes primero)
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    const loadRecords = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await apiService.getRecords();
        if (response.data.status === 'OK') {
          recordStore.setRecords(response.data.data);
        }
      } catch (err) {
        console.error('Error cargando records:', err);
        error.value = 'Error al cargar los records';
      } finally {
        loading.value = false;
      }
    };

    const loadWods = async () => {
      try {
        const response = await apiService.getWods();
        if (response.data.status === 'OK') {
          availableWods.value = response.data.data;
        }
      } catch (err) {
        console.error('Error cargando WODs:', err);
      }
    };

    const loadUsers = async () => {
      if (!authStore.isTrainer) return;
      
      try {
        const response = await apiService.getMembers();
        if (response.data.status === 'OK') {
          availableUsers.value = response.data.data;
        }
      } catch (err) {
        console.error('Error cargando usuarios:', err);
      }
    };

    const createRecord = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const recordData = {
          ...newRecord,
          user_id: authStore.user?.id
        };
        
        const response = await apiService.createRecord(recordData);
        if (response.data.status === 'OK') {
          await loadRecords();
          cancelCreate();
        }
      } catch (err) {
        console.error('Error creando record:', err);
        error.value = 'Error al crear el record';
      } finally {
        loading.value = false;
      }
    };

    const cancelCreate = () => {
      showCreateForm.value = false;
      Object.keys(newRecord).forEach(key => {
        if (key === 'date') {
          newRecord[key] = today;
        } else {
          newRecord[key] = '';
        }
      });
      error.value = '';
    };

    const editRecord = (record) => {
      editingRecord.value = { ...record };
    };

    const closeEditModal = () => {
      editingRecord.value = null;
      error.value = '';
    };

    const updateRecord = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const recordData = { ...editingRecord.value };
        delete recordData.id;
        delete recordData.created_at;
        delete recordData.updated_at;
        
        const response = await apiService.updateRecord(editingRecord.value.id, recordData);
        if (response.data.status === 'OK') {
          await loadRecords();
          closeEditModal();
        }
      } catch (err) {
        console.error('Error actualizando record:', err);
        error.value = 'Error al actualizar el record';
      } finally {
        loading.value = false;
      }
    };

    const deleteRecord = async (recordId) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este record?')) {
        return;
      }
      
      try {
        await apiService.deleteRecord(recordId);
        await loadRecords();
      } catch (err) {
        console.error('Error eliminando record:', err);
        error.value = 'Error al eliminar el record';
      }
    };

    const canEditRecord = (record) => {
      return authStore.isTrainer || record.user_id === authStore.user?.id;
    };

    const getWodName = (wodId) => {
      const wod = availableWods.value.find(w => w.id === wodId);
      return wod ? wod.name : 'WOD desconocido';
    };

    const getUserName = (userId) => {
      const user = availableUsers.value.find(u => u.id === userId);
      return user ? user.name : 'Usuario desconocido';
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };

    const formatDateTime = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('es-ES');
    };

    onMounted(async () => {
      await Promise.all([
        loadRecords(),
        loadWods(),
        loadUsers()
      ]);
    });

    return {
      authStore,
      records,
      filteredRecords,
      loading,
      error,
      showCreateForm,
      editingRecord,
      wodFilter,
      userFilter,
      dateFilter,
      availableWods,
      availableUsers,
      today,
      newRecord,
      hasFilters,
      createRecord,
      cancelCreate,
      editRecord,
      closeEditModal,
      updateRecord,
      deleteRecord,
      canEditRecord,
      getWodName,
      getUserName,
      formatDate,
      formatDateTime
    };
  }
};
</script>

<style scoped>
.records-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.records-header h2 {
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
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

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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

.no-records {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.5;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.record-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.record-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.record-date {
  background-color: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.record-result {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #4CAF50;
}

.result-label {
  display: block;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.25rem;
}

.result-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.record-notes {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fff3cd;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
  font-size: 0.9rem;
}

.record-user {
  margin-bottom: 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.record-meta {
  color: #6c757d;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.record-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
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
  .records-container {
    padding: 1rem;
  }

  .records-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }

  .record-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .record-actions {
    flex-direction: column;
  }
}
</style>
