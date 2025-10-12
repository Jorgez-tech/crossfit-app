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
import logger from '../utils/logger';

export default {
  name: 'RecordsList',
  setup() {
    const authStore = useAuthStore();
    const recordStore = useRecordStore();
    const log = logger.scoped('RecordsList');
    
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
      let filtered = [...records.value];
      
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
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);

          switch (dateFilter.value) {
            case 'today':
              return recordDate.toDateString() === now.toDateString();
            case 'week':
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
        log.error('Error cargando records', err);
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
        log.error('Error cargando WODs', err);
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
        log.error('Error cargando usuarios', err);
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
        log.error('Error creando record', err);
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
        log.error('Error actualizando record', err);
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
        log.error('Error eliminando record', err);
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
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--spacing-xl, 32px) var(--spacing-lg, 24px);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl, 32px);
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md, 16px);
  padding: var(--spacing-lg, 24px) var(--spacing-xl, 32px);
  background: rgba(15, 23, 42, 0.82);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(18px);
  color: var(--color-white, #ffffff);
}

.records-header h2 {
  margin: 0;
  font-size: var(--font-size-2xl, 26px);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.add-btn {
  background: linear-gradient(135deg, var(--color-success, #22c55e), var(--color-success-light, #4ade80));
  color: var(--color-white, #ffffff);
  border: none;
  padding: var(--spacing-sm, 12px) var(--spacing-xl, 32px);
  border-radius: 16px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  min-height: var(--touch-target-min, 44px);
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 50px rgba(34, 197, 94, 0.32);
  filter: brightness(1.05);
}

.create-form {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  padding: var(--spacing-xl, 32px);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(16px);
}

.create-form h3 {
  margin: 0 0 var(--spacing-lg, 24px) 0;
  font-size: var(--font-size-xl, 20px);
  font-weight: 600;
  color: var(--color-text, #0f172a);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg, 24px);
  margin-bottom: var(--spacing-lg, 24px);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 8px);
}

.form-group label {
  font-weight: 500;
  color: var(--color-text-light, #475569);
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: var(--spacing-sm, 12px) var(--spacing-md, 16px);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  font-size: 1rem;
  font-family: inherit;
  background: rgba(248, 250, 252, 0.85);
  color: var(--color-text, #0f172a);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.45);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  background: rgba(255, 255, 255, 0.95);
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md, 16px);
  margin-top: var(--spacing-lg, 24px);
}

.submit-btn {
  background: linear-gradient(135deg, var(--color-primary, #2563eb), var(--color-accent, #0ea5e9));
  color: var(--color-white, #ffffff);
  border: none;
  padding: var(--spacing-sm, 12px) var(--spacing-xl, 32px);
  border-radius: 16px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  min-height: var(--touch-target-min, 44px);
  box-shadow: 0 22px 48px rgba(37, 99, 235, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 26px 58px rgba(14, 165, 233, 0.32);
  filter: brightness(1.04);
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.cancel-btn {
  background: rgba(148, 163, 184, 0.2);
  color: var(--color-text, #0f172a);
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: var(--spacing-sm, 12px) var(--spacing-xl, 32px);
  border-radius: 16px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  min-height: var(--touch-target-min, 44px);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.cancel-btn:hover {
  transform: translateY(-1px);
  background: rgba(148, 163, 184, 0.28);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md, 16px);
  padding: var(--spacing-lg, 24px);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(14px);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 8px);
}

.filter-group label {
  font-weight: 500;
  color: var(--color-text-light, #475569);
}

.filter-group select {
  padding: var(--spacing-sm, 12px) var(--spacing-md, 16px);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(248, 250, 252, 0.85);
  font-size: 1rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.filter-group select:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.45);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.loading {
  text-align: center;
  padding: var(--spacing-xl, 32px);
  color: var(--color-muted, #94a3b8);
  font-size: 1rem;
}

.error {
  background: rgba(248, 113, 113, 0.12);
  color: #b91c1c;
  padding: var(--spacing-md, 16px);
  border-radius: 14px;
  border: 1px solid rgba(248, 113, 113, 0.35);
  margin-bottom: var(--spacing-lg, 24px);
  text-align: center;
}

.no-records {
  text-align: center;
  padding: var(--spacing-2xl, 48px);
  color: var(--color-text-light, #475569);
  font-size: 1.05rem;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(12px);
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg, 24px);
}

.record-card {
  background: rgba(255, 255, 255, 0.9);
  padding: var(--spacing-xl, 32px);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow: 0 24px 58px rgba(15, 23, 42, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
}

.record-card:hover {
  transform: translateY(-6px);
  border-color: rgba(14, 165, 233, 0.45);
  box-shadow: 0 30px 72px rgba(14, 165, 233, 0.18);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md, 16px);
}

.record-header h3 {
  margin: 0;
  font-size: var(--font-size-xl, 20px);
  font-weight: 600;
  color: var(--color-text, #0f172a);
}

.record-date {
  background: rgba(14, 165, 233, 0.12);
  color: var(--color-accent, #0ea5e9);
  padding: var(--spacing-xs, 8px) var(--spacing-sm, 12px);
  border-radius: 999px;
  font-size: 0.85rem;
  white-space: nowrap;
  border: 1px solid rgba(14, 165, 233, 0.25);
}

.record-result {
  background: rgba(37, 99, 235, 0.08);
  padding: var(--spacing-md, 16px) var(--spacing-lg, 24px);
  border-radius: 18px;
  border: 1px solid rgba(37, 99, 235, 0.18);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 8px);
}

.result-label {
  font-weight: 600;
  color: var(--color-text-light, #475569);
  font-size: 0.95rem;
}

.result-value {
  font-size: var(--font-size-2xl, 26px);
  font-weight: 700;
  color: var(--color-primary, #2563eb);
  line-height: 1.2;
}

.record-notes {
  padding: var(--spacing-md, 16px);
  border-radius: 18px;
  background: rgba(250, 204, 21, 0.12);
  border: 1px solid rgba(250, 204, 21, 0.25);
  color: #b45309;
  font-size: 0.95rem;
}

.record-user {
  color: var(--color-text-light, #475569);
  font-size: 0.95rem;
}

.record-meta {
  color: var(--color-muted, #94a3b8);
  font-size: 0.85rem;
}

.record-actions {
  display: flex;
  gap: var(--spacing-sm, 12px);
  flex-wrap: wrap;
}

.edit-btn,
.delete-btn {
  padding: var(--spacing-xs, 8px) var(--spacing-lg, 24px);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  min-height: 42px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #ffffff;
  box-shadow: 0 18px 40px rgba(245, 158, 11, 0.25);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 50px rgba(249, 115, 22, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  box-shadow: 0 18px 40px rgba(239, 68, 68, 0.25);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 50px rgba(220, 38, 38, 0.35);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--spacing-lg, 24px);
  backdrop-filter: blur(10px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.92);
  padding: var(--spacing-xl, 32px);
  border-radius: 24px;
  max-width: 520px;
  width: min(100%, 520px);
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 34px 70px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(14px);
}

.modal-content h2 {
  margin: 0 0 var(--spacing-lg, 24px) 0;
  font-size: var(--font-size-xl, 20px);
  font-weight: 600;
  color: var(--color-text, #0f172a);
}

@media (max-width: 768px) {
  .records-container {
    padding: var(--spacing-lg, 24px) var(--spacing-md, 16px);
  }

  .records-header {
    flex-direction: column;
    text-align: center;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }

  .record-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .record-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .add-btn:hover,
  .submit-btn:hover,
  .cancel-btn:hover,
  .record-card:hover,
  .edit-btn:hover,
  .delete-btn:hover {
    transform: none;
    box-shadow: none;
    filter: none;
  }
}
</style>
