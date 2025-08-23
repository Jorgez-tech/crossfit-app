<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ isRegisterMode ? 'Registro' : 'Iniciar Sesión' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Campos de registro -->
        <div v-if="isRegisterMode" class="form-group">
          <label for="name">Nombre completo:</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Tu nombre completo"
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Tu contraseña"
          />
        </div>

        <!-- Campos adicionales para registro -->
        <div v-if="isRegisterMode">
          <div class="form-group">
            <label for="role">Rol:</label>
            <select id="role" v-model="form.role" required>
              <option value="">Selecciona tu rol</option>
              <option value="atleta">Atleta</option>
              <option value="entrenador">Entrenador</option>
            </select>
          </div>

          <div class="form-group">
            <label for="gender">Género:</label>
            <select id="gender" v-model="form.gender">
              <option value="">Selecciona género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="dateOfBirth">Fecha de nacimiento:</label>
            <input
              id="dateOfBirth"
              v-model="form.dateOfBirth"
              type="date"
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          :disabled="loading"
        >
          {{ loading ? 'Procesando...' : (isRegisterMode ? 'Registrarse' : 'Iniciar Sesión') }}
        </button>
      </form>

      <div class="toggle-mode">
        <p>
          {{ isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
          <button @click="toggleMode" class="link-btn">
            {{ isRegisterMode ? 'Iniciar Sesión' : 'Registrarse' }}
          </button>
        </p>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/main';

export default {
  name: 'LoginComponent',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const isRegisterMode = ref(false);
    const loading = ref(false);
    const error = ref('');
    const success = ref('');
    
    const form = reactive({
      name: '',
      email: '',
      password: '',
      role: '',
      gender: '',
      dateOfBirth: ''
    });

    const resetForm = () => {
      form.name = '';
      form.email = '';
      form.password = '';
      form.role = '';
      form.gender = '';
      form.dateOfBirth = '';
      error.value = '';
      success.value = '';
    };

    const toggleMode = () => {
      isRegisterMode.value = !isRegisterMode.value;
      resetForm();
    };

    const handleSubmit = async () => {
      if (loading.value) return;
      
      loading.value = true;
      error.value = '';
      success.value = '';

      try {
        if (isRegisterMode.value) {
          // Registro
          const userData = {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role
          };
          
          if (form.gender) userData.gender = form.gender;
          if (form.dateOfBirth) userData.dateOfBirth = form.dateOfBirth;
          
          await authStore.register(userData);
          success.value = 'Registro exitoso. Redirigiendo...';
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          // Login
          await authStore.login({
            email: form.email,
            password: form.password
          });
          
          success.value = 'Login exitoso. Redirigiendo...';
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      } catch (err) {
        console.error('Error de autenticación:', err);
        if (err.response && err.response.data && err.response.data.data) {
          error.value = err.response.data.data.error || 'Error en la autenticación';
        } else {
          error.value = 'Error de conexión. Inténtalo de nuevo.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      isRegisterMode,
      loading,
      error,
      success,
      form,
      toggleMode,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.toggle-mode {
  text-align: center;
  margin-top: 1.5rem;
}

.link-btn {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.link-btn:hover {
  color: #45a049;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}
</style>
