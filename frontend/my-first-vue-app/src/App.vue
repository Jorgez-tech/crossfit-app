<template>
  <div id="app">
    <nav v-if="authStore.isAuthenticated">
      <router-link to="/">🏠 Home</router-link>
      <router-link to="/wods">🏋️ WODs</router-link>
      <router-link to="/records">� Records</router-link>
      <router-link v-if="authStore.user?.role === 'entrenador'" to="/members">👥 Members</router-link>
      <router-link :to="authStore.user?.role === 'entrenador' ? '/trainer' : '/athlete'">📱 Dashboard</router-link>
      <router-link to="/profile">👤 Perfil</router-link>
      <div data-cy="user-menu">
        <button @click="handleLogout" class="logout-btn" data-cy="logout-button">🚪 Salir</button>
      </div>
    </nav>
    
    <nav v-else>
      <router-link to="/">🏠 Home</router-link>
      <router-link to="/crossfit">🏋️ CrossFit WODs</router-link>
      <router-link to="/login">🔐 Login</router-link>
    </nav>
    
    <header v-if="!authStore.isAuthenticated">
      <h1>Alto Rendimiento 360</h1>
    </header>
    
    <main>
      <router-view />
    </main>
    
    <footer>
      <p>&copy; 2025 Alto Rendimiento 360</p>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from './stores/main';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Error en logout:', error);
      }
    };

    return {
      authStore,
      handleLogout
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  margin-bottom: 20px;
}

nav {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

nav a {
  margin: 0 15px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.1);
}

nav a:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

nav a.router-link-exact-active {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.logout-btn {
  margin: 0 15px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.1);
  border: none;
  cursor: pointer;
  font-size: inherit;
}

.logout-btn:hover {
  background: rgba(255, 0, 0, 0.3);
  transform: translateY(-2px);
}

header {
  background: linear-gradient(135deg, #42b983, #27ae60);
  color: white;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 300;
}

main {
  padding: 30px 20px 80px;
  min-height: calc(100vh - 200px);
}

footer {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  padding: 15px;
  position: fixed;
  width: 100%;
  bottom: 0;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}
</style>
