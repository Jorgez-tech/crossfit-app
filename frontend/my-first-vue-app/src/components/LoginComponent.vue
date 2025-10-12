<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ isRegisterMode ? 'Registro' : 'Iniciar Sesión' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form" data-cy="login-form">
        <!-- Campos de registro -->
        <div v-if="isRegisterMode" class="form-group">
          <label for="name">Nombre completo:</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Tu nombre completo"
            data-cy="register-name-input"
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
            :data-cy="isRegisterMode ? 'register-email-input' : 'email-input'"
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
            :data-cy="isRegisterMode ? 'register-password-input' : 'password-input'"
          />
        </div>

        <!-- Campos adicionales para registro -->
        <div v-if="isRegisterMode">
          <div class="form-group">
            <label for="role">Rol:</label>
            <select id="role" v-model="form.role" required data-cy="register-role-select">
              <option value="">Selecciona tu rol</option>
              <option value="atleta">Atleta</option>
              <option value="entrenador">Entrenador</option>
            </select>
          </div>

          <div class="form-group">
            <label for="gender">Género:</label>
            <select id="gender" v-model="form.gender" data-cy="register-gender-select">
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
              data-cy="register-date-input"
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          :disabled="loading"
          :data-cy="isRegisterMode ? 'register-button' : 'login-button'"
        >
          {{ loading ? 'Procesando...' : (isRegisterMode ? 'Registrarse' : 'Iniciar Sesión') }}
        </button>
      </form>

      <div class="toggle-mode">
        <p>
          {{ isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
          <button @click="toggleMode" class="link-btn" data-cy="register-tab">
            {{ isRegisterMode ? 'Iniciar Sesión' : 'Registrarse' }}
          </button>
        </p>
      </div>

      <div v-if="error" class="error-message" data-cy="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message" data-cy="success-message">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/main';
import logger from '../utils/logger';

export default {
  name: 'LoginComponent',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const log = logger.scoped('LoginComponent');
    
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
        log.error('Error de autenticación', err);
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
  padding: var(--spacing-xl, 32px);
  background:
    radial-gradient(circle at 5% 0%, rgba(14, 165, 233, 0.25), transparent 55%),
    radial-gradient(circle at 95% 10%, rgba(37, 99, 235, 0.18), transparent 60%),
    linear-gradient(180deg, rgba(248, 250, 252, 0.92) 0%, rgba(224, 242, 254, 0.95) 100%);
}

.login-card {
  width: min(100%, 400px);
  padding: var(--spacing-2xl, 48px) var(--spacing-xl, 32px);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--color-border, rgba(148, 163, 184, 0.35));
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(24px);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 24px);
}

.login-card h2 {
  text-align: center;
  margin: 0;
  font-size: var(--font-size-2xl, 26px);
  font-weight: 600;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, var(--color-primary, #2563eb), var(--color-accent, #0ea5e9));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
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
.form-group select {
  padding: var(--spacing-sm, 12px) var(--spacing-md, 16px);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  font-size: 1rem;
  background: rgba(248, 250, 252, 0.85);
  color: var(--color-text, #0f172a);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  background: rgba(255, 255, 255, 0.95);
}

.submit-btn {
  background: linear-gradient(135deg, var(--color-primary, #2563eb), var(--color-accent, #0ea5e9));
  color: var(--color-white, #ffffff);
  padding: var(--spacing-sm, 12px) var(--spacing-lg, 24px);
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
  margin-top: var(--spacing-md, 16px);
  box-shadow: 0 18px 40px rgba(37, 99, 235, 0.22);
  min-height: var(--touch-target-min, 44px);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 22px 48px rgba(14, 165, 233, 0.28);
  filter: brightness(1.05);
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  box-shadow: none;
}

.toggle-mode {
  text-align: center;
  margin-top: var(--spacing-sm, 12px);
  color: var(--color-muted, #94a3b8);
  font-size: 0.95rem;
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-primary, #2563eb);
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  font-weight: 600;
  transition: color 0.25s ease;
}

.link-btn:hover {
  color: var(--color-accent, #0ea5e9);
}

.error-message,
.success-message {
  padding: var(--spacing-sm, 12px) var(--spacing-md, 16px);
  border-radius: 12px;
  text-align: center;
  border: 1px solid transparent;
  font-weight: 500;
}

.error-message {
  background: rgba(248, 113, 113, 0.12);
  border-color: rgba(248, 113, 113, 0.3);
  color: #b91c1c;
}

.success-message {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.3);
  color: #15803d;
}

@media (max-width: 600px) {
  .login-card {
    padding: var(--spacing-xl, 32px) var(--spacing-lg, 24px);
    border-radius: 20px;
  }

  .login-card h2 {
    font-size: var(--font-size-xl, 20px);
  }
}
</style>
