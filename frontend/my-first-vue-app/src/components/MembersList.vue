<template>
  <div class="members-container">
    <div class="members-header">
      <h2>Gestión de Miembros</h2>
      <button 
        @click="showCreateForm = true"
        class="add-btn"
      >
        + Nuevo Miembro
      </button>
    </div>

    <!-- Formulario para crear nuevo miembro -->
    <div v-if="showCreateForm" class="create-form">
      <h3>Registrar Nuevo Miembro</h3>
      <form @submit.prevent="createMember">
        <div class="form-row">
          <div class="form-group">
            <label for="memberName">Nombre completo:</label>
            <input 
              id="memberName"
              v-model="newMember.name" 
              type="text" 
              required 
              placeholder="Nombre completo del miembro"
            />
          </div>
          
          <div class="form-group">
            <label for="memberEmail">Email:</label>
            <input 
              id="memberEmail"
              v-model="newMember.email" 
              type="email" 
              required 
              placeholder="email@ejemplo.com"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="memberPassword">Contraseña temporal:</label>
            <input 
              id="memberPassword"
              v-model="newMember.password" 
              type="password" 
              required 
              placeholder="Contraseña inicial"
            />
          </div>
          
          <div class="form-group">
            <label for="memberRole">Rol:</label>
            <select id="memberRole" v-model="newMember.role" required>
              <option value="">Seleccionar rol</option>
              <option value="atleta">Atleta</option>
              <option value="entrenador">Entrenador</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="memberGender">Género:</label>
            <select id="memberGender" v-model="newMember.gender">
              <option value="">Seleccionar género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="memberBirth">Fecha de nacimiento:</label>
            <input 
              id="memberBirth"
              v-model="newMember.dateOfBirth" 
              type="date"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrar Miembro' }}
          </button>
          <button type="button" @click="cancelCreate" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <div class="search-group">
        <label for="search">Buscar miembro:</label>
        <input 
          id="search"
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar por nombre o email..."
        />
      </div>
      
      <div class="filter-group">
        <label for="roleFilter">Filtrar por rol:</label>
        <select id="roleFilter" v-model="roleFilter">
          <option value="">Todos los roles</option>
          <option value="atleta">Atletas</option>
          <option value="entrenador">Entrenadores</option>
        </select>
      </div>
    </div>

    <!-- Lista de miembros -->
    <div v-if="loading && members.length === 0" class="loading">
      Cargando miembros...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="filteredMembers.length === 0" class="no-members">
      {{ searchTerm || roleFilter ? 'No se encontraron miembros con los filtros aplicados.' : 'No hay miembros registrados.' }}
    </div>
    
    <div v-else class="members-grid">
      <div 
        v-for="member in filteredMembers" 
        :key="member.id" 
        class="member-card"
      >
        <div class="member-avatar">
          <div class="avatar-placeholder">
            {{ getInitials(member.name) }}
          </div>
        </div>
        
        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p class="member-email">{{ member.email }}</p>
          
          <div class="member-details">
            <span class="member-role" :class="member.role">
              {{ member.role === 'entrenador' ? 'Entrenador' : 'Atleta' }}
            </span>
            
            <span v-if="member.gender" class="member-gender">
              {{ getGenderLabel(member.gender) }}
            </span>
            
            <span v-if="member.dateOfBirth" class="member-age">
              {{ calculateAge(member.dateOfBirth) }} años
            </span>
          </div>
          
          <div class="member-stats">
            <small>Miembro desde: {{ formatDate(member.created_at) }}</small>
          </div>
        </div>
        
        <div class="member-actions">
          <button @click="editMember(member)" class="edit-btn" title="Editar">
            Editar
          </button>
          <button @click="deleteMember(member.id)" class="delete-btn" title="Eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para editar miembro -->
    <div v-if="editingMember" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>Editar Miembro</h2>
        <form @submit.prevent="updateMember">
          <div class="form-group">
            <label for="editName">Nombre:</label>
            <input 
              id="editName"
              v-model="editingMember.name" 
              type="text" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="editEmail">Email:</label>
            <input 
              id="editEmail"
              v-model="editingMember.email" 
              type="email" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="editRole">Rol:</label>
            <select id="editRole" v-model="editingMember.role" required>
              <option value="atleta">Atleta</option>
              <option value="entrenador">Entrenador</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="editGender">Género:</label>
            <select id="editGender" v-model="editingMember.gender">
              <option value="">No especificado</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="editBirth">Fecha de nacimiento:</label>
            <input 
              id="editBirth"
              v-model="editingMember.dateOfBirth" 
              type="date"
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
import { useAuthStore, useMemberStore } from '../stores/main';
import apiService from '../services/api';
import logger from '../utils/logger';

export default {
  name: 'MembersList',
  setup() {
    const authStore = useAuthStore();
    const memberStore = useMemberStore();
    const log = logger.scoped('MembersList');
    
    const loading = ref(false);
    const error = ref('');
    const showCreateForm = ref(false);
    const editingMember = ref(null);
    const searchTerm = ref('');
    const roleFilter = ref('');
    
    const newMember = reactive({
      name: '',
      email: '',
      password: '',
      role: '',
      gender: '',
      dateOfBirth: ''
    });
    
    const members = computed(() => memberStore.members);
    
    const filteredMembers = computed(() => {
      let filtered = members.value;
      
      if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        filtered = filtered.filter(member => 
          member.name.toLowerCase().includes(search) ||
          member.email.toLowerCase().includes(search)
        );
      }
      
      if (roleFilter.value) {
        filtered = filtered.filter(member => member.role === roleFilter.value);
      }
      
      return filtered;
    });

    const loadMembers = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await apiService.getMembers();
        if (response.data.status === 'OK') {
          memberStore.setMembers(response.data.data);
        }
      } catch (err) {
        log.error('Error cargando miembros', err);
        error.value = 'Error al cargar los miembros';
      } finally {
        loading.value = false;
      }
    };

    const createMember = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const memberData = { ...newMember };
        if (memberData.dateOfBirth) {
          // Convertir fecha al formato DD/MM/YYYY que espera el backend
          const date = new Date(memberData.dateOfBirth);
          memberData.dateOfBirth = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
        
        const response = await apiService.createMember(memberData);
        if (response.data.status === 'OK') {
          await loadMembers();
          cancelCreate();
        }
      } catch (err) {
        log.error('Error creando miembro', err);
        if (err.response && err.response.data && err.response.data.data) {
          error.value = err.response.data.data.error || 'Error al crear el miembro';
        } else {
          error.value = 'Error al crear el miembro';
        }
      } finally {
        loading.value = false;
      }
    };

    const cancelCreate = () => {
      showCreateForm.value = false;
      Object.keys(newMember).forEach(key => {
        newMember[key] = '';
      });
      error.value = '';
    };

    const editMember = (member) => {
      editingMember.value = { ...member };
      // Convertir fecha para el input date
      if (editingMember.value.dateOfBirth) {
        const [day, month, year] = editingMember.value.dateOfBirth.split('/');
        editingMember.value.dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    };

    const closeEditModal = () => {
      editingMember.value = null;
      error.value = '';
    };

    const updateMember = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const memberData = { ...editingMember.value };
        delete memberData.id; // No enviar el ID en el body
        delete memberData.created_at; // No enviar timestamps
        delete memberData.updated_at;
        
        if (memberData.dateOfBirth) {
          const date = new Date(memberData.dateOfBirth);
          memberData.dateOfBirth = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
        
        const response = await apiService.updateMember(editingMember.value.id, memberData);
        if (response.data.status === 'OK') {
          await loadMembers();
          closeEditModal();
        }
      } catch (err) {
        log.error('Error actualizando miembro', err);
        error.value = 'Error al actualizar el miembro';
      } finally {
        loading.value = false;
      }
    };

    const deleteMember = async (memberId) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
        return;
      }
      
      try {
        await apiService.deleteMember(memberId);
        await loadMembers();
      } catch (err) {
        log.error('Error eliminando miembro', err);
        error.value = 'Error al eliminar el miembro';
      }
    };

    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getGenderLabel = (gender) => {
      const labels = {
        'male': 'M',
        'female': 'F',
        'other': 'O'
      };
      return labels[gender] || '';
    };

    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) return '';
      const [day, month, year] = dateOfBirth.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };

    onMounted(() => {
      // Verificar permisos
      if (!authStore.isTrainer) {
        error.value = 'No tienes permisos para ver esta página';
        return;
      }
      
      loadMembers();
    });

    return {
      members,
      filteredMembers,
      loading,
      error,
      showCreateForm,
      editingMember,
      searchTerm,
      roleFilter,
      newMember,
      createMember,
      cancelCreate,
      editMember,
      closeEditModal,
      updateMember,
      deleteMember,
      getInitials,
      getGenderLabel,
      calculateAge,
      formatDate
    };
  }
};
</script>

<style scoped>
.members-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.members-header h2 {
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
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
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
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-group,
.filter-group {
  display: flex;
  flex-direction: column;
}

.search-group label,
.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.search-group input,
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

.no-members {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.1rem;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.member-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.member-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.member-info {
  flex: 1;
}

.member-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.member-email {
  color: #6c757d;
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
}

.member-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.member-role {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.member-role.entrenador {
  background-color: #dc3545;
  color: white;
}

.member-role.atleta {
  background-color: #17a2b8;
  color: white;
}

.member-gender,
.member-age {
  background-color: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.member-stats {
  color: #6c757d;
  font-size: 0.8rem;
}

.member-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.edit-btn {
  background-color: #ffc107;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
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
  .members-container {
    padding: 1rem;
  }

  .members-header {
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

  .members-grid {
    grid-template-columns: 1fr;
  }

  .member-card {
    flex-direction: column;
    text-align: center;
  }

  .member-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
